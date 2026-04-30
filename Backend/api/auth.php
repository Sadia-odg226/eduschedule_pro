<?php
// API d'authentification (login et inscription)
header("Content-Type: application/json");
require_once '../config/cors.php';
require_once '../config/database.php';

// Récupérer la méthode HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Traiter les différentes méthodes HTTP
switch ($method) {
    case 'POST':
        // Récupérer les données JSON du corps de la requête
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Vérifier quelle action est demandée
        if (isset($data['action'])) {
            switch ($data['action']) {
                case 'login':
                    // Appeler la fonction de connexion
                    login($conn, $data);
                    break;
                case 'register':
                    // Appeler la fonction d'inscription
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

// Fonction pour se connecter
function login($conn, $data) {
    // Vérifier que l'email et le mot de passe sont fournis
    if (!isset($data['email']) || !isset($data['password'])) {
        echo json_encode(["error" => "Email et mot de passe requis"]);
        return;
    }

    $email = $data['email'];
    $password = $data['password'];

    // Chercher l'utilisateur dans la base de données
    $stmt = $conn->prepare("SELECT id, mot_de_passe_hash, role, actif FROM utilisateurs WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    // Vérifier si l'utilisateur existe
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // Vérifier le mot de passe et que le compte est actif
        if ($user['actif'] && password_verify($password, $user['mot_de_passe_hash'])) {
            // Retourner les informations de l'utilisateur
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

// Fonction pour s'inscrire
function register($conn, $data) {
    // Vérifier que tous les champs requis sont fournis
    if (!isset($data['email']) || !isset($data['password']) || !isset($data['role'])) {
        echo json_encode(["error" => "Email, mot de passe et rôle requis"]);
        return;
    }

    $email = $data['email'];
    // Hash du mot de passe pour la sécurité
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $role = $data['role'];

    // Insérer le nouvel utilisateur dans la base
    $stmt = $conn->prepare("INSERT INTO utilisateurs (email, mot_de_passe_hash, role) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $email, $password, $role);

    // Exécuter et retourner le résultat
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Utilisateur créé"]);
    } else {
        echo json_encode(["error" => "Erreur lors de la création"]);
    }
    $stmt->close();
}

$conn->close();
?>
