<?php
require_once '../config/cors.php';
require_once '../config/database.php';
header('Content-Type: application/json');

// On teste le chemin 1 (Dossier Backend)
$path1 = __DIR__ . '/../db_config.php';
// On teste le chemin 2 (Racine du projet)
$path2 = __DIR__ . '/../../db_config.php';

if (file_exists($path1)) {
    require_once $path1;
} elseif (file_exists($path2)) {
    require_once $path2;
} else {
    die(json_encode([
        "error" => "Fichier introuvable",
        "recherche_dans_Backend" => $path1,
        "recherche_dans_Racine" => $path2
    ]));
}

// Le reste du code...
$sql = "SELECT * FROM salles";
$result = $conn->query($sql);

if ($result) {
    $salles = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($salles);
} else {
    echo json_encode(["error" => $conn->error]);
}