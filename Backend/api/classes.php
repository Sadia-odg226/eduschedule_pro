<?php
include_once "../config/database.php";
include_once "../config/cors.php";

$methode = $_SERVER['REQUEST_METHOD'];

if ($methode == 'GET') {
    $stmt = $conn->query("SELECT * FROM classes");
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($classes);
}

if ($methode == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare(
        "INSERT INTO classes (code, libelle, annee_academique) 
         VALUES (:code, :libelle, :annee)"
    );
    $stmt->execute([
        ':code' => $data->code,
        ':libelle' => $data->libelle,
        ':annee' => $data->annee_academique
    ]);
    echo json_encode(["message" => "Classe créée avec succès"]);
}
?>