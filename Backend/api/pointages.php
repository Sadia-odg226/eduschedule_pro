<?php
header("Content-Type: application/json");
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getPointage($conn, $_GET['id']);
        } elseif (isset($_GET['id_creneau'])) {
            getPointagesByCreneau($conn, $_GET['id_creneau']);
        } else {
            getPointages($conn);
        }
        break;
    case 'POST':
        createPointage($conn);
        break;
    case 'PUT':
        updatePointage($conn);
        break;
    case 'DELETE':
        deletePointage($conn);
        break;
    default:
        echo json_encode(["error" => "Méthode non supportée"]);
}

function getPointages($conn) {
    $sql = "SELECT p.*, c.jour, c.heure_debut, c.heure_fin, m.libelle as matiere
            FROM pointages p
            LEFT JOIN creneaux c ON p.id_creneau = c.id
            LEFT JOIN matieres m ON c.id_matiere = m.id
            ORDER BY p.heure_pointage_reelle DESC";
    $result = $conn->query($sql);

    $pointages = [];
    while ($row = $result->fetch_assoc()) {
        $pointages[] = $row;
    }

    echo json_encode($pointages);
}

function getPointage($conn, $id) {
    $stmt = $conn->prepare("SELECT p.*, c.jour, c.heure_debut, c.heure_fin, m.libelle as matiere
                            FROM pointages p
                            LEFT JOIN creneaux c ON p.id_creneau = c.id
                            LEFT JOIN matieres m ON c.id_matiere = m.id
                            WHERE p.id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "Pointage non trouvé"]);
    }
    $stmt->close();
}

function getPointagesByCreneau($conn, $id_creneau) {
    $stmt = $conn->prepare("SELECT * FROM pointages WHERE id_creneau = ? ORDER BY heure_pointage_reelle DESC");
    $stmt->bind_param("i", $id_creneau);
    $stmt->execute();
    $result = $stmt->get_result();

    $pointages = [];
    while ($row = $result->fetch_assoc()) {
        $pointages[] = $row;
    }

    echo json_encode($pointages);
    $stmt->close();
}

function createPointage($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    $required = ['id_creneau', 'token_utilise', 'statut'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            echo json_encode(["error" => "Champ requis manquant: $field"]);
            return;
        }
    }

    $heure_pointage = isset($data['heure_pointage_reelle']) ? $data['heure_pointage_reelle'] : date('Y-m-d H:i:s');
    $ip_source = $_SERVER['REMOTE_ADDR'];

    $stmt = $conn->prepare("INSERT INTO pointages (id_creneau, heure_pointage_reelle, ip_source, token_utilise, statut) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $data['id_creneau'], $heure_pointage, $ip_source, $data['token_utilise'], $data['statut']);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["error" => "Erreur lors de la création"]);
    }
    $stmt->close();
}

function updatePointage($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        echo json_encode(["error" => "ID requis"]);
        return;
    }

    $fields = ['id_creneau', 'heure_pointage_reelle', 'ip_source', 'token_utilise', 'statut'];
    $updates = [];
    $types = "";
    $values = [];

    foreach ($fields as $field) {
        if (isset($data[$field])) {
            $updates[] = "$field = ?";
            $types .= "s";
            $values[] = $data[$field];
        }
    }

    if (empty($updates)) {
        echo json_encode(["error" => "Aucun champ à mettre à jour"]);
        return;
    }

    $types .= "i";
    $values[] = $data['id'];

    $sql = "UPDATE pointages SET " . implode(", ", $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$values);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Erreur lors de la mise à jour"]);
    }
    $stmt->close();
}

function deletePointage($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        echo json_encode(["error" => "ID requis"]);
        return;
    }

    $stmt = $conn->prepare("DELETE FROM pointages WHERE id = ?");
    $stmt->bind_param("i", $data['id']);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Erreur lors de la suppression"]);
    }
    $stmt->close();
}

$conn->close();
?>