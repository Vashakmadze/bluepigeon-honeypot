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

$sql = "SELECT * FROM users";
$result = $connection->query($sql);

function sanitize_input($input) {
  return preg_replace('/<script\b[^>]*>.*<\/script>/i', '', $input);;
}

?>
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" type="text/css" href="style.css">
  <script src="index.js"></script>
  <title>User Management</title>
</head>

<body>
  <div id="app">
    <div class="nav">
      <label for="name">Name:</label>
        <input type="text" id="name" name="name"><br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email"><br>
      <button class="add" type="submit"> Add User</button>
    </div>
    <div class="admin-panel">
      <div class="user-section">
        <h2>Overview of registered users</h2>
        <div class="user-list">
          <div class="user-list-item header-item">
            <span>Name</span>
            <span>email</span>
            <span>Logged In</span>
            <span>Access (true - enabled)</span>
            <span class="action-buttons">Action</span>
          </div>
          <?php
            while ($row = $result->fetch_assoc()) {
                echo "<div class='user-list-item'>";
                echo "<span>" . sanitize_input($row['name']) . "</span>";
                echo "<span>" . sanitize_input($row['email']) . "</span>";
                echo "<span>" . sanitize_input($row['logged']) . "</span>";
                echo "<span>" . sanitize_input($row['status']) . "</span>";
                echo "            
                <span class='action-buttons'>
                  <button class='delete' id='" . $row['status'] . "' value='" . $row['id'] . "'>Delete</button>
                  <button class='enable' id='" . $row['status'] . "' type='submit' value='" . $row['id'] . "'>Toggle Status</button>
              </span>";
                echo "</div>";
            }
          ?>
        </div>
      </div>
    </div>
  </div>
  <script>

</script>
</body>
</html>