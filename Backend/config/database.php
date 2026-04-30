<?php
$host = "localhost";
$db_nom = "eduschedule_db";
$username = "root";
$password = "";

try {
    $conn = new PDO(
        "mysql:host=$host;dbname=$db_nom", 
        $username, 
        $password
    );
    $conn->setAttribute(
        PDO::ATTR_ERRMODE, 
        PDO::ERRMODE_EXCEPTION
    );
} catch (PDOException $e) {
    echo "Erreur connexion : " . $e->getMessage();
}
?>