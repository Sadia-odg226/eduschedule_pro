<?php
header("Content-Type: application/json");
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['action'])) {
            switch ($data['action']) {
                case 'login':
                    login($conn, $data);
                    break;
                case 'register':
                    register($conn, $data);
                    break;
                default:
                    echo json_encode(["error" => "Action non reconnue"]);
            }
        } else {
            echo json_encode(["error" => "Action requise"]);
        }
        break;
    default:
        echo json_encode(["error" => "Méthode non supportée"]);
}

function login($conn, $data) {
    if (!isset($data['email']) || !isset($data['password'])) {
        echo json_encode(["error" => "Email et mot de passe requis"]);
        return;
    }

    $email = $data['email'];
    $password = $data['password'];

    $stmt = $conn->prepare("SELECT id, mot_de_passe_hash, role, actif FROM utilisateurs WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if ($user['actif'] && password_verify($password, $user['mot_de_passe_hash'])) {
            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => $user['id'],
                    "email" => $email,
                    "role" => $user['role']
                ]
            ]);
        } else {
            echo json_encode(["error" => "Identifiants invalides ou compte inactif"]);
        }
    } else {
        echo json_encode(["error" => "Utilisateur non trouvé"]);
    }
    $stmt->close();
}

function register($conn, $data) {
    if (!isset($data['email']) || !isset($data['password']) || !isset($data['role'])) {
        echo json_encode(["error" => "Email, mot de passe et rôle requis"]);
        return;
    }

    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $role = $data['role'];

    $stmt = $conn->prepare("INSERT INTO utilisateurs (email, mot_de_passe_hash, role) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $email, $password, $role);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Utilisateur créé"]);
    } else {
        echo json_encode(["error" => "Erreur lors de la création"]);
    }
    $stmt->close();
}

$conn->close();
?>
