<?php
header("Content-Type: application/json");

// Simulation de données
$classes = [
    ["id" => 1, "nom" => "Ingénieur des Travaux - RT", "niveau" => "L3"],
    ["id" => 2, "nom" => "Génie Électrique", "niveau" => "L2"]
];

echo json_encode($classes);
