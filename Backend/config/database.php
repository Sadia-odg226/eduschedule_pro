<?php
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
// Configuration de la connexion à la base de données MySQL
// Paramètres de connexion à eduschedule_db
$host = "localhost";
$user = "root";
$pass = ""; 
$dbname = "eduschedule_db";

// Créer la connexion MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

// Vérifier si la connexion a réussi
if ($conn->connect_error) {
    header('Content-Type: application/json');
    // Retourner une erreur en JSON
    die(json_encode(["error" => "Échec de la connexion : " . $conn->connect_error]));
}

// Définir l'encodage UTF-8 pour supporter les accents
$conn->set_charset("utf8");
?>
>>>>>>> 7992188c6da92f51abc4e37c5435bb138f034f47
=======
// Paramètres de connexion
$host = "localhost";
$user = "root";
$pass = ""; 
$dbname = "eduschedule_db"; // <--- METS LE VRAI NOM ICI

// Création de la connexion
$conn = new mysqli($host, $user, $pass, $dbname);

// Vérification de la connexion
if ($conn->connect_error) {
    header('Content-Type: application/json');
    die(json_encode(["error" => "Échec de la connexion : " . $conn->connect_error]));
}

// Encodage pour les accents
$conn->set_charset("utf8");
?>
>>>>>>> b901838cbab66ada205cb879c2b5b808f89fea4f
