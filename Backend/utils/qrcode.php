<?php
require_once '../config/cors.php';
require_once '../config/database.php';
require_once '../vendor/autoload.php';

use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $id_creneau = $_GET['id_creneau'] ?? null;
    
    if (!$id_creneau) {
        echo json_encode(["error" => "id_creneau requis"]);
        exit();
    }
    
    // Générer le token QR
    $token = hash('sha256', $id_creneau . time() . 'eduschedule_secret');
    $expire = date('Y-m-d H:i:s', strtotime('+2 hours'));
    
    // Sauvegarder le token dans la base
    $stmt = $conn->prepare("UPDATE creneaux SET qr_token = ?, qr_expire = ? WHERE id = ?");
    $stmt->bind_param("ssi", $token, $expire, $id_creneau);
    $stmt->execute();
    
    // Générer l'image QR-Code
    $options = new QROptions([
        'outputType' => QRCode::OUTPUT_IMAGE_PNG,
        'eccLevel' => QRCode::ECC_L,
        'scale' => 5,
    ]);
    
    $qrcode = new QRCode($options);
    $image = $qrcode->render(json_encode([
        'id_creneau' => $id_creneau,
        'token' => $token
    ]));
    
    echo json_encode([
        "success" => true,
        "token" => $token,
        "expire" => $expire,
        "image" => $image
    ]);
}

$conn->close();
?>