<?php 

define('UPLOAD_DIR', 'templates/');   
$dir    = 'templates/*.png';
$files = glob($dir);
header('Content-Type: application/json');
echo (json_encode($files));
