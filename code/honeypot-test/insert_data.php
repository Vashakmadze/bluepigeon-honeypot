<?php
// Database connection
$host = 'localhost';
$username = 'root';
$password = 'root';
$database = 'users';

$connection = new mysqli($host, $username, $password, $database);

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
} 


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get data from the POST request
    $data = json_decode(file_get_contents("php://input"));

    $name = $data->name;
    $email = $data->email;

    // Create an SQL INSERT statement
    $sql = "INSERT INTO users (name, email, logged, status) VALUES ('$email', '$email', false, true)";

    if ($connection->query($sql)) {
        echo "Data inserted successfully.";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close the statement and connection
    $connection->close();
}
?>
