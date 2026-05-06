<?php
include_once "../config/database.php";
include_once "../config/cors.php";

$methode = $_SERVER['REQUEST_METHOD'];

if ($methode == 'GET') {
    $stmt = $conn->query("SELECT * FROM matieres");
    $matieres = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($matieres);
}

if ($methode == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare(
        "INSERT INTO matieres (code, libelle, volume_horaire_total, coefficient) 
         VALUES (:code, :libelle, :volume, :coefficient)"
    );
    $stmt->execute([
        ':code' => $data->code,
        ':libelle' => $data->libelle,
        ':volume' => $data->volume_horaire_total,
        ':coefficient' => $data->coefficient
    ]);
    echo json_encode(["message" => ""]);
}
?>