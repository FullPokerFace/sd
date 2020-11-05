<?php 

$path = $_POST['path'];   
$svg_file = file_get_contents($path);


$find_string   = '<svg';
$position = strpos($svg_file, $find_string);

$svg_file_new = substr($svg_file, $position);

echo $svg_file_new;




?>