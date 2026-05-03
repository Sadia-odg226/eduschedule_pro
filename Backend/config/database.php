
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

