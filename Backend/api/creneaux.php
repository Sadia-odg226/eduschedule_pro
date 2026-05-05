<?php
require_once '../config/cors.php';
require_once '../config/database.php';
header("Content-Type: application/json");
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getCreneau($conn, $_GET['id']);
        } else {
            getCreneaux($conn);
        }
        break;
    case 'POST':
        createCreneau($conn);
        break;
    case 'PUT':
        updateCreneau($conn);
        break;
    case 'DELETE':
        deleteCreneau($conn);
        break;
    default:
        echo json_encode(["error" => "Méthode non supportée"]);
}

function getCreneaux($conn) {
    $sql = "SELECT c.*, m.libelle as matiere, e.nom, e.prenom, s.code as salle
            FROM creneaux c
            LEFT JOIN matieres m ON c.id_matiere = m.id
            LEFT JOIN enseignants e ON c.id_enseignant = e.id
            LEFT JOIN salles s ON c.id_salle = s.id";
    $result = $conn->query($sql);

    $creneaux = [];
    while ($row = $result->fetch_assoc()) {
        $creneaux[] = $row;
    }

    echo json_encode($creneaux);
}

function getCreneau($conn, $id) {
    $stmt = $conn->prepare("SELECT c.*, m.libelle as matiere, e.nom, e.prenom, s.code as salle
                            FROM creneaux c
                            LEFT JOIN matieres m ON c.id_matiere = m.id
                            LEFT JOIN enseignants e ON c.id_enseignant = e.id
                            LEFT JOIN salles s ON c.id_salle = s.id
                            WHERE c.id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "Créneau non trouvé"]);
    }
    $stmt->close();
}

function createCreneau($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    $required = ['id_emploi_temps', 'id_enseignant', 'id_salle', 'jour', 'heure_debut', 'heure_fin'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            echo json_encode(["error" => "Champ requis manquant: $field"]);
            return;
        }
    }

    // Si matiere_texte est fourni, chercher ou créer la matière
$id_matiere = null;
if (isset($data['matiere_texte']) && !empty($data['matiere_texte'])) {
    $matiere_texte = $data['matiere_texte'];
    $check = $conn->prepare("SELECT id FROM matieres WHERE libelle = ? OR nom = ?");
    $check->bind_param("ss", $matiere_texte, $matiere_texte);
    $check->execute();
    $result = $check->get_result();
    if ($result->num_rows > 0) {
        $id_matiere = $result->fetch_assoc()['id'];
    } else {
        $insert = $conn->prepare("INSERT INTO matieres (libelle) VALUES (?)");
        $insert->bind_param("s", $matiere_texte);
        $insert->execute();
        $id_matiere = $insert->insert_id;
    }
} elseif (isset($data['id_matiere'])) {
    $id_matiere = $data['id_matiere'];
}

$stmt = $conn->prepare("INSERT INTO creneaux (id_emploi_temps, id_matiere, id_enseignant, id_salle, jour, heure_debut, heure_fin) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("iiiisss", $data['id_emploi_temps'], $id_matiere, $data['id_enseignant'], $data['id_salle'], $data['jour'], $data['heure_debut'], $data['heure_fin']);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["error" => "Erreur lors de la création"]);
    }
    $stmt->close();
}

function updateCreneau($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        echo json_encode(["error" => "ID requis"]);
        return;
    }

    $fields = ['id_emploi_temps', 'id_matiere', 'id_enseignant', 'id_salle', 'jour', 'heure_debut', 'heure_fin'];
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

    $sql = "UPDATE creneaux SET " . implode(", ", $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$values);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Erreur lors de la mise à jour"]);
    }
    $stmt->close();
}

function deleteCreneau($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        echo json_encode(["error" => "ID requis"]);
        return;
    }

    $stmt = $conn->prepare("DELETE FROM creneaux WHERE id = ?");
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
