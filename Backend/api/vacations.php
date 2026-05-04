<?php

require_once '../config/cors.php';
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getVacations($conn);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['action']) && $data['action'] === 'generer') {
            genererVacation($conn, $data);
        }
        break;
    default:
        echo json_encode(["error" => "Méthode non supportée"]);
}

function getVacations($conn) {
    $id_enseignant = $_GET['id_enseignant'] ?? null;
    
    if ($id_enseignant) {
        $stmt = $conn->prepare("
            SELECT v.*, e.nom, e.prenom 
            FROM vacations v
            JOIN enseignants e ON v.id_enseignant = e.id
            WHERE v.id_enseignant = ?
            ORDER BY v.annee DESC, v.mois DESC
        ");
        $stmt->bind_param("i", $id_enseignant);
    } else {
        $stmt = $conn->prepare("
            SELECT v.*, e.nom, e.prenom 
            FROM vacations v
            JOIN enseignants e ON v.id_enseignant = e.id
            ORDER BY v.annee DESC, v.mois DESC
        ");
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $vacations = [];
    
    while ($row = $result->fetch_assoc()) {
        $vacations[] = $row;
    }
    
    echo json_encode(["success" => true, "data" => $vacations]);
}

function genererVacation($conn, $data) {
    $id_enseignant = $data['id_enseignant'];
    $mois = $data['mois'];
    $annee = $data['annee'];
    
    // Récupérer les créneaux de l'enseignant pour ce mois
    $stmt = $conn->prepare("
        SELECT c.*, c.heure_debut, c.heure_fin
        FROM creneaux c
        JOIN emploi_temps et ON c.id_emploi_temps = et.id
        WHERE c.id_enseignant = ?
    ");
    $stmt->bind_param("i", $id_enseignant);
    $stmt->execute();
    $result = $stmt->get_result();
    $creneaux = [];
    
    while ($row = $result->fetch_assoc()) {
        $creneaux[] = $row;
    }
    
    // Récupérer le taux horaire de l'enseignant
    $stmt2 = $conn->prepare("SELECT taux_horaire FROM enseignants WHERE id = ?");
    $stmt2->bind_param("i", $id_enseignant);
    $stmt2->execute();
    $enseignant = $stmt2->get_result()->fetch_assoc();
    $taux = $enseignant['taux_horaire'];
    
    // Calculer le montant total
    $total_heures = 0;
    foreach ($creneaux as $creneau) {
        $debut = strtotime($creneau['heure_debut']);
        $fin = strtotime($creneau['heure_fin']);
        $duree = ($fin - $debut) / 3600;
        $total_heures += $duree;
    }
    
    $montant_brut = $total_heures * $taux;
    $montant_net = $montant_brut;
    
    // Insérer la vacation
    $stmt3 = $conn->prepare("
        INSERT INTO vacations (id_enseignant, mois, annee, montant_brut, montant_net, statut)
        VALUES (?, ?, ?, ?, ?, 'generee')
    ");
    $stmt3->bind_param("iiddd", $id_enseignant, $mois, $annee, $montant_brut, $montant_net);
    
    if ($stmt3->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Vacation générée",
            "montant_brut" => $montant_brut,
            "montant_net" => $montant_net,
            "total_heures" => $total_heures
        ]);
    } else {
        echo json_encode(["error" => "Erreur lors de la génération"]);
    }
}

$conn->close();
?>