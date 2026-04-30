<?php
header("Content-Type: application/json");
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getCahier($conn, $_GET['id']);
        } elseif (isset($_GET['id_creneau'])) {
            getCahiersByCreneau($conn, $_GET['id_creneau']);
        } else {
            getCahiers($conn);
        }
        break;
    case 'POST':
        createCahier($conn);
        break;
    case 'PUT':
        updateCahier($conn);
        break;
    case 'DELETE':
        deleteCahier($conn);
        break;
    default:
        echo json_encode(["error" => "Méthode non supportée"]);
}

function getCahiers($conn) {
    $sql = "SELECT ct.*, c.jour, c.heure_debut, c.heure_fin, m.libelle as matiere, e.nom, e.prenom
            FROM cahiers_texte ct
            LEFT JOIN creneaux c ON ct.id_creneau = c.id
            LEFT JOIN matieres m ON c.id_matiere = m.id
            LEFT JOIN enseignants e ON c.id_enseignant = e.id
            ORDER BY ct.date_creation DESC";
    $result = $conn->query($sql);

    $cahiers = [];
    while ($row = $result->fetch_assoc()) {
        $cahiers[] = $row;
    }

    echo json_encode($cahiers);
}

function getCahier($conn, $id) {
    $stmt = $conn->prepare("SELECT ct.*, c.jour, c.heure_debut, c.heure_fin, m.libelle as matiere, e.nom, e.prenom
                            FROM cahiers_texte ct
                            LEFT JOIN creneaux c ON ct.id_creneau = c.id
                            LEFT JOIN matieres m ON c.id_matiere = m.id
                            LEFT JOIN enseignants e ON c.id_enseignant = e.id
                            WHERE ct.id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "Cahier non trouvé"]);
    }
    $stmt->close();
}

function getCahiersByCreneau($conn, $id_creneau) {
    $stmt = $conn->prepare("SELECT * FROM cahiers_texte WHERE id_creneau = ? ORDER BY date_creation DESC");
    $stmt->bind_param("i", $id_creneau);
    $stmt->execute();
    $result = $stmt->get_result();

    $cahiers = [];
    while ($row = $result->fetch_assoc()) {
        $cahiers[] = $row;
    }

    echo json_encode($cahiers);
    $stmt->close();
}

function createCahier($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    $required = ['id_creneau', 'titre_cours', 'contenu_json', 'statut'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            echo json_encode(["error" => "Champ requis manquant: $field"]);
            return;
        }
    }

    $id_delegue = isset($data['id_delegue']) ? $data['id_delegue'] : null;
    $heure_fin_reelle = isset($data['heure_fin_reelle']) ? $data['heure_fin_reelle'] : null;

    $stmt = $conn->prepare("INSERT INTO cahiers_texte (id_creneau, id_delegue, titre_cours, contenu_json, heure_fin_reelle, statut) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iissss", $data['id_creneau'], $id_delegue, $data['titre_cours'], $data['contenu_json'], $heure_fin_reelle, $data['statut']);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["error" => "Erreur lors de la création"]);
    }
    $stmt->close();
}

function updateCahier($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        echo json_encode(["error" => "ID requis"]);
        return;
    }

    $fields = ['id_creneau', 'id_delegue', 'titre_cours', 'contenu_json', 'heure_fin_reelle', 'statut'];
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

    $sql = "UPDATE cahiers_texte SET " . implode(", ", $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$values);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Erreur lors de la mise à jour"]);
    }
    $stmt->close();
}

function deleteCahier($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        echo json_encode(["error" => "ID requis"]);
        return;
    }

    $stmt = $conn->prepare("DELETE FROM cahiers_texte WHERE id = ?");
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
