<?php
$host = 'localhost';
$username = 'root';
$password = 'root';
$database = 'users';

$connection = new mysqli($host, $username, $password, $database);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve user input
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // Vulnerable SQL query (for challenge purposes, not for production)
    $query = "SELECT * FROM adminuser WHERE username = '$username' AND password = '$password'";
    
    // Execute the query (vulnerable)
    $result = $connection->query($query);
    
    // Check if the login was successful
    if ($result->num_rows > 0) {
        header('Location: http://canarytokens.com/static/feedback/ribuyw0w9t5q8hkxgliklug4q/submit.aspx'); // change this to another token which redirects to local server
        exit();
    } else {
        echo "Login failed. Please try again.";
    }
}
?>