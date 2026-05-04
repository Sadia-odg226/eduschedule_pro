<?php
require_once '../config/cors.php';
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getEmploiTemps($conn);
        break;
    default:
        echo json_encode(["error" => "Méthode non supportée"]);
}

function getEmploiTemps($conn) {
    $id_classe = $_GET['id_classe'] ?? null;
    
    if ($id_classe) {
        $stmt = $conn->prepare("
            SELECT c.*, m.libelle as matiere, e.nom, e.prenom, s.code as salle
            FROM creneaux c
            JOIN emploi_temps et ON c.id_emploi_temps = et.id
            JOIN matieres m ON c.id_matiere = m.id
            JOIN enseignants e ON c.id_enseignant = e.id
            JOIN salles s ON c.id_salle = s.id
            WHERE et.id_classe = ?
        ");
        $stmt->bind_param("i", $id_classe);
    } else {
        $stmt = $conn->prepare("
            SELECT c.*, m.libelle as matiere, e.nom, e.prenom, s.code as salle
            FROM creneaux c
            JOIN emploi_temps et ON c.id_emploi_temps = et.id
            JOIN matieres m ON c.id_matiere = m.id
            JOIN enseignants e ON c.id_enseignant = e.id
            JOIN salles s ON c.id_salle = s.id
        ");
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $creneaux = [];
    
    while ($row = $result->fetch_assoc()) {
        $creneaux[] = $row;
    }
    
    echo json_encode(["success" => true, "data" => $creneaux]);
}

$conn->close();
?>