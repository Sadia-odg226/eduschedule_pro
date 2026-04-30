<?php
include_once "../config/database.php";
include_once "../config/cors.php";

$methode = $_SERVER['REQUEST_METHOD'];

if ($methode == 'GET') {
    $stmt = $conn->query("SELECT * FROM salles");
    $salles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($salles);
}

if ($methode == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare(
        "INSERT INTO salles 
         (code, capacite, equipements, batiment) 
         VALUES (:code, :capacite, :equipements, :batiment)"
    );
    $stmt->execute([
        ':code' => $data->code,
        ':capacite' => $data->capacite,
        ':equipements' => $data->equipements,
        ':batiment' => $data->batiment
    ]);
}
?>