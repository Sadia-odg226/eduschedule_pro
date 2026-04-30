<?php
// Middleware d'authentification pour les requêtes protégées
// Utilise des tokens JWT (simplifié ici)

require_once '../config/database.php';

// Fonction pour vérifier l'authentification
function checkAuth($conn) {
    // Récupérer tous les en-têtes HTTP
    $headers = getallheaders();

    // Vérifier si le token d'autorisation est présent
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(["error" => "Token d'autorisation manquant"]);
        exit();
    }

    // Extraire le token du format "Bearer TOKEN"
    $authHeader = $headers['Authorization'];
    if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["error" => "Format de token invalide"]);
        exit();
    }

    $token = $matches[1];

    // Vérifier le token (implémentation simple)
    $userId = verifyToken($token);

    if (!$userId) {
        http_response_code(401);
        echo json_encode(["error" => "Token invalide"]);
        exit();
    }

    // Vérifier que l'utilisateur existe et est actif
    $stmt = $conn->prepare("SELECT id, email, role, actif FROM utilisateurs WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows !== 1) {
        http_response_code(401);
        echo json_encode(["error" => "Utilisateur non trouvé"]);
        exit();
    }

    $user = $result->fetch_assoc();
    if (!$user['actif']) {
        http_response_code(401);
        echo json_encode(["error" => "Compte inactif"]);
        exit();
    }

    $stmt->close();
    return $user;
}

// Fonction pour vérifier la validité d'un token
function verifyToken($token) {
    // Implémentation simple : le token est l'ID utilisateur hashé avec un sel
    // À améliorer avec JWT en production
    $salt = "eduschedule_salt_2024";
    
    // Essayer les IDs de 1 à 100 (pour la démo)
    for ($userId = 1; $userId <= 100; $userId++) {
        if (hash('sha256', $userId . $salt) === $token) {
            return $userId;
        }
    }

    return false;
}

// Fonction pour générer un token
function generateToken($userId) {
    $salt = "eduschedule_salt_2024";
    return hash('sha256', $userId . $salt);
}

// Fonction pour vérifier le rôle de l'utilisateur
function requireRole($user, $requiredRole) {
    if ($user['role'] !== $requiredRole) {
        http_response_code(403);
        echo json_encode(["error" => "Rôle insuffisant"]);
        exit();
    }
}
?>
