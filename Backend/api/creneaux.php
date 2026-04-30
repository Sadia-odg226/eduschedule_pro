<?php
// API pour gérer les créneaux horaires
header("Content-Type: application/json");
require_once '../config/cors.php';
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

// Traiter les différentes méthodes HTTP
switch ($method) {
    case 'GET':
        // Récupérer un créneau spécifique ou tous les créneaux
        if (isset($_GET['id'])) {
            getCreneau($conn, $_GET['id']);
        } else {
            getCreneaux($conn);
        }
        break;
    case 'POST':
        // Créer un nouveau créneau
        createCreneau($conn);
        break;
    case 'PUT':
        // Modifier un créneau
        updateCreneau($conn);
        break;
    case 'DELETE':
        // Supprimer un créneau
        deleteCreneau($conn);
        break;
    default:
        echo json_encode(["error" => "Méthode non supportée"]);
}

// Fonction pour récupérer tous les créneaux
function getCreneaux($conn) {
    // Requête SQL avec jointure pour récupérer les infos liées
    $sql = "SELECT c.*, m.libelle as matiere, e.nom, e.prenom, s.code as salle
            FROM creneaux c
            LEFT JOIN matieres m ON c.id_matiere = m.id
            LEFT JOIN enseignants e ON c.id_enseignant = e.id
            LEFT JOIN salles s ON c.id_salle = s.id";
    $result = $conn->query($sql);

    // Convertir les résultats en tableau
    $creneaux = [];
    while ($row = $result->fetch_assoc()) {
        $creneaux[] = $row;
    }

    // Retourner en JSON
    echo json_encode($creneaux);
}

// Fonction pour récupérer un créneau spécifique
function getCreneau($conn, $id) {
    // Requête paramétrée pour éviter les injections SQL
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

// Fonction pour créer un créneau
function createCreneau($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    // Vérifier que tous les champs requis sont présents
    $required = ['id_emploi_temps', 'id_matiere', 'id_enseignant', 'id_salle', 'jour', 'heure_debut', 'heure_fin'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            echo json_encode(["error" => "Champ requis manquant: $field"]);
            return;
        }
    }

    // Insérer le nouveau créneau
    $stmt = $conn->prepare("INSERT INTO creneaux (id_emploi_temps, id_matiere, id_enseignant, id_salle, jour, heure_debut, heure_fin) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iiiisss", $data['id_emploi_temps'], $data['id_matiere'], $data['id_enseignant'], $data['id_salle'], 
                      $data['jour'], $data['heure_debut'], $data['heure_fin']);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["error" => "Erreur lors de la création"]);
    }
    $stmt->close();
}

// Fonction pour modifier un créneau
function updateCreneau($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        echo json_encode(["error" => "ID requis"]);
        return;
    }

    // Construire la requête de mise à jour dynamiquement
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

// Fonction pour supprimer un créneau
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
