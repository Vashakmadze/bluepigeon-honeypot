<!DOCTYPE html>
  <?php
  $cookie_name = "databasefile_url";
  $cookie_value = "YWNjZXNzIC9kb3dubG9hZC5waHAgdG8gZXhwb3J0IGFsbCB0aGUgdXNlciBkYXRhLg==";
  setcookie($cookie_name, $cookie_value, time() + (86400 * 90), "/"); // 86400 = 1 day
?>
<html>
<head>
    <title>Admin Panel</title>
</head>
<body style="display: flex; justify-content: center; flex-direction: column; align-items:center; height:90vh;">
    <h1>Login</h1>
    <form action="login.php" method="post" style="display:flex; flex-direction: column;">
        <label for="username">Username:</label>
        <input type="text" name="username" id="username" required><br>
        <label for="password">Password:</label>
        <input type="password" name="password" id="password" required><br>
        <input type="submit" value="Login">
    </form>
</body>
</html>
