<?php
require_once '../config/database.php';

function checkAuth($conn) {
    $headers = getallheaders();

    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(["error" => "Token d'autorisation manquant"]);
        exit();
    }

    $authHeader = $headers['Authorization'];
    if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["error" => "Format de token invalide"]);
        exit();
    }

    $token = $matches[1];

    // Pour cet exemple, on suppose que le token est l'ID utilisateur hashé
    // En production, utiliser JWT ou un système plus robuste
    $userId = verifyToken($token);

    if (!$userId) {
        http_response_code(401);
        echo json_encode(["error" => "Token invalide"]);
        exit();
    }

    // Vérifier si l'utilisateur existe et est actif
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

function verifyToken($token) {
    // Implémentation simple : le token est l'ID utilisateur hashé avec un sel
    // En production, utiliser JWT
    $salt = "eduschedule_salt_2024";
    $users = [1, 2, 3]; // IDs d'exemple

    foreach ($users as $userId) {
        if (hash('sha256', $userId . $salt) === $token) {
            return $userId;
        }
    }

    return false;
}

function generateToken($userId) {
    $salt = "eduschedule_salt_2024";
    return hash('sha256', $userId . $salt);
}

function requireRole($user, $requiredRole) {
    if ($user['role'] !== $requiredRole) {
        http_response_code(403);
        echo json_encode(["error" => "Rôle insuffisant"]);
        exit();
    }
}
?>