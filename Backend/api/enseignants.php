<?php
require_once '../config/cors.php';
require_once '../config/database.php';
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM enseignants");
    $enseignants = [];
    while ($row = $result->fetch_assoc()) {
        $enseignants[] = $row;
    }
    echo json_encode(["success" => true, "data" => $enseignants]);
} else {
    echo json_encode(["error" => "Méthode non supportée"]);
}

$conn->close();
?>