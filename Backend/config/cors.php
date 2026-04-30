<?php
<<<<<<< HEAD
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
?>
=======
// Configuration CORS pour autoriser les requêtes du frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Si c'est une requête OPTIONS, retourner 200 et arrêter
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
>>>>>>> 7992188c6da92f51abc4e37c5435bb138f034f47
