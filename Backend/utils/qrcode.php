<?php
require_once '../config/database.php';

class QRCodeGenerator {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function generateForCreneau($creneauId) {
        // Générer un token unique
        $token = $this->generateToken();

        // Définir l'expiration (par exemple, 2 heures après le début du créneau)
        $stmt = $this->conn->prepare("SELECT heure_debut FROM creneaux WHERE id = ?");
        $stmt->bind_param("i", $creneauId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows !== 1) {
            return ["error" => "Créneau non trouvé"];
        }

        $creneau = $result->fetch_assoc();
        $heureDebut = strtotime($creneau['heure_debut']);
        $expiration = date('Y-m-d H:i:s', $heureDebut + 7200); // +2 heures

        // Mettre à jour le créneau avec le token et l'expiration
        $updateStmt = $this->conn->prepare("UPDATE creneaux SET qr_token = ?, qr_expire = ? WHERE id = ?");
        $updateStmt->bind_param("ssi", $token, $expiration, $creneauId);

        if ($updateStmt->execute()) {
            // Générer le QR code
            $qrData = json_encode([
                'creneau_id' => $creneauId,
                'token' => $token,
                'expires' => $expiration
            ]);

            return [
                'success' => true,
                'token' => $token,
                'qr_data' => $qrData,
                'expires' => $expiration
            ];
        } else {
            return ["error" => "Erreur lors de la mise à jour du créneau"];
        }
    }

    public function validateToken($token) {
        $stmt = $this->conn->prepare("SELECT id, qr_expire FROM creneaux WHERE qr_token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows !== 1) {
            return ["valid" => false, "error" => "Token invalide"];
        }

        $creneau = $result->fetch_assoc();
        $now = time();
        $expire = strtotime($creneau['qr_expire']);

        if ($now > $expire) {
            return ["valid" => false, "error" => "Token expiré"];
        }

        return ["valid" => true, "creneau_id" => $creneau['id']];
    }

    private function generateToken() {
        return bin2hex(random_bytes(32));
    }
}

// Fonction utilitaire pour générer un QR code en base64
function generateQRCodeImage($data, $size = 200) {
    // Utiliser une bibliothèque QR code comme phpqrcode si disponible
    // Pour cet exemple, on retourne juste les données
    // En production, installer une bibliothèque QR code

    // Exemple avec une URL d'API Google Charts (non recommandé pour production)
    $url = "https://chart.googleapis.com/chart?chs={$size}x{$size}&cht=qr&chl=" . urlencode($data);

    // Récupérer l'image et la convertir en base64
    $imageData = file_get_contents($url);
    if ($imageData) {
        return "data:image/png;base64," . base64_encode($imageData);
    }

    return null;
}
?>