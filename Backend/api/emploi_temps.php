<?php
include_once "../config/database.php";
include_once "../config/cors.php";

$methode = $_SERVER['REQUEST_METHOD'];

if ($methode == 'GET') {
    $id_classe = $_GET['id_classe'] ?? null;
    $semaine = $_GET['semaine'] ?? null;
    
    $sql = "SELECT * FROM emploi_temps WHERE 1=1";
    if ($id_classe) $sql .= " AND id_classe = :id_classe";
    if ($semaine) $sql .= " AND semaine_debut = :semaine";
    
    $stmt = $conn->prepare($sql);
    if ($id_classe) $stmt->bindParam(':id_classe', $id_classe);
    if ($semaine) $stmt->bindParam(':semaine', $semaine);
    $stmt->execute();
    
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

if ($methode == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare(
        "INSERT INTO emploi_temps 
         (id_classe, semaine_debut, statut_publication, cree_par) 
         VALUES (:id_classe, :semaine_debut, 'brouillon', :cree_par)"
    );
    $stmt->execute([
        ':id_classe' => $data->id_classe,
        ':semaine_debut' => $data->semaine_debut,
        ':cree_par' => $data->cree_par
    ]);
    
}
?>