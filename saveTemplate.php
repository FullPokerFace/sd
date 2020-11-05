<?php
define('UPLOAD_DIR', 'templates/');
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0777, true);
}
$layerJSON = $_POST['layerJSON'];

$fileName = $_POST['fileName'];
$data = json_decode($layerJSON, true);
$file = UPLOAD_DIR . $fileName . '.json';
$success = file_put_contents($file, $layerJSON);
print $success ? $file : 'Unable to save the file.';

$img = $_POST['imgBase64'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$file = UPLOAD_DIR . $fileName . '.png';
$success = file_put_contents($file, $data);
echo $img;
//print $success ? $file : 'Unable to save the file.';
