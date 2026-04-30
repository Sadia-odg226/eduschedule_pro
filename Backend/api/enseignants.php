<?php
header("Content-Type: application/json");
require_once '../db_config.php'; 

try {
    // On récupère tous les enseignants de la table
    $requete = $pdo->query("SELECT * FROM enseignants");
    $resultats = $requete->fetchAll(PDO::FETCH_ASSOC);

    // On affiche le résultat en JSON
    echo json_encode($resultats);

} catch (Exception $e) {
    // Si la table n'existe pas ou s'il y a une erreur SQL
    echo json_encode(["erreur" => $e->getMessage()]);
}
?>