<?php
// Utilitaire pour générer et valider les codes QR
require_once '../config/database.php';

// Classe pour gérer les codes QR
class QRCodeGenerator {
    private $conn;

    // Constructeur
    public function __construct($conn) {
        $this->conn = $conn;
    }

    // Générer un code QR pour un créneau
    public function generateForCreneau($creneauId) {
        // Générer un token unique et aléatoire
        $token = $this->generateToken();

        // Récupérer l'heure de début du créneau pour calculer l'expiration
        $stmt = $this->conn->prepare("SELECT heure_debut FROM creneaux WHERE id = ?");
        $stmt->bind_param("i", $creneauId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows !== 1) {
            return ["error" => "Créneau non trouvé"];
        }

        $creneau = $result->fetch_assoc();
        // Calculer le timestamp de l'heure de début
        $heureDebut = strtotime($creneau['heure_debut']);
        // Ajouter 2 heures pour l'expiration
        $expiration = date('Y-m-d H:i:s', $heureDebut + 7200);

        // Mettre à jour le créneau avec le token et l'expiration
        $updateStmt = $this->conn->prepare("UPDATE creneaux SET qr_token = ?, qr_expire = ? WHERE id = ?");
        $updateStmt->bind_param("ssi", $token, $expiration, $creneauId);

        if ($updateStmt->execute()) {
            // Préparer les données du QR code en JSON
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

    // Valider un token de QR code
    public function validateToken($token) {
        // Chercher le créneau avec ce token
        $stmt = $this->conn->prepare("SELECT id, qr_expire FROM creneaux WHERE qr_token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows !== 1) {
            return ["valid" => false, "error" => "Token invalide"];
        }

        $creneau = $result->fetch_assoc();
        // Vérifier l'expiration du token
        $now = time();
        $expire = strtotime($creneau['qr_expire']);

        if ($now > $expire) {
            return ["valid" => false, "error" => "Token expiré"];
        }

        return ["valid" => true, "creneau_id" => $creneau['id']];
    }

    // Générer un token aléatoire
    private function generateToken() {
        // Générer 32 bytes aléatoires et les convertir en hexadécimal
        return bin2hex(random_bytes(32));
    }
}

// Fonction utilitaire pour générer une image QR code en base64
function generateQRCodeImage($data, $size = 200) {
    // Utiliser une bibliothèque QR code comme phpqrcode si disponible
    // Pour ce prototype, on utilise l'API Google Charts

    // Créer l'URL de l'API Google Charts
    $url = "https://chart.googleapis.com/chart?chs={$size}x{$size}&cht=qr&chl=" . urlencode($data);

    // Récupérer l'image et la convertir en base64
    $imageData = file_get_contents($url);
    if ($imageData) {
        // Retourner en format data URI pour afficher dans une image HTML
        return "data:image/png;base64," . base64_encode($imageData);
    }

    return null;
}
?>
