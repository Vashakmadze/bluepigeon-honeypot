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

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"));

    $id = $data->id;
    $status = $data->status;

    $sql = "UPDATE users SET status = '$status' WHERE id = '$id'";

    if ($connection->query($sql)) {
        echo "Data inserted successfully.";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close the statement and connection
    $connection->close();

}