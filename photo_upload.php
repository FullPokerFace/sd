<?php
define('UPLOAD_DIR', 'uploads/');   
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0777, true);
}
$img = $_POST['imgBase64'];   
$fileName = $_POST['fileName'];   
$img = str_replace('data:image/png;base64,', '', $img);   
$img = str_replace(' ', '+', $img);   
$data = base64_decode($img);   
$file = UPLOAD_DIR . $fileName . '.png';   
$success = file_put_contents($file, $data);   
print $success ? $file : 'Unable to save the file.';
?>