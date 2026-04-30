<?php
header("Content-Type: application/json");

$matieres = [
    ["id" => 1, "nom" => "Réseaux Mobiles", "code" => "RT301"],
    ["id" => 2, "nom" => "Sécurité Informatique", "code" => "RT305"]
];

echo json_encode($matieres);
?>