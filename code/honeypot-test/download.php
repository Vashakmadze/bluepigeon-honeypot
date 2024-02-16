<?php
// File to be downloaded
$filename = "data.xlsx";

if (file_exists($filename)) {
    // Set headers for file download
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($filename) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filename));
    readfile($filename);

    // Perform the redirect after the download
    header("Location: $redirect_url");
    exit;
} else {
    // If the file does not exist, you can handle the error or provide a message to the user.
    echo "File not found.";
}
?>
