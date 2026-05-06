<?php
include_once "../config/database.php";
include_once "../config/cors.php";

$methode = $_SERVER['REQUEST_METHOD'];

if ($methode == 'GET') {
    $stmt = $conn->query("SELECT * FROM enseignants");
    $enseignants = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($enseignants);
}

if ($methode == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare(
        "INSERT INTO enseignants 
         (matricule, nom, prenom, email, specialite, statut, taux_horaire) 
         VALUES (:matricule, :nom, :prenom, :email, :specialite, :statut, :taux)"
    );
    $stmt->execute([
        ':matricule' => $data->matricule,
        ':nom' => $data->nom,
        ':prenom' => $data->prenom,
        ':email' => $data->email,
        ':specialite' => $data->specialite,
        ':statut' => $data->statut,
        ':taux' => $data->taux_horaire
    ]);
}
?>