<?php

$q = $_POST['q'];
$limit = $_POST['limit'];
$page = $_POST['page'];

session_start();



if (!isset($_SESSION["flatIconToken"]) && !isset($_SESSION["flatIconTokenExpires"])) {
  getAccessToken();
  getImages($_SESSION["flatIconToken"], $q, $page, $limit);
} else {
  $date = new DateTime();
  $now = $date->getTimestamp();
  if ($now < $_SESSION["flatIconTokenExpires"]) {
    getImages($_SESSION["flatIconToken"], $q, $page, $limit);
  } else {
    getAccessToken();
    getImages($_SESSION["flatIconToken"], $q, $page, $limit);
  }
}



function getAccessToken()
{
  $curl = curl_init();
  curl_setopt_array($curl, array(
    CURLOPT_URL => "https://api.flaticon.com/v2/app/authentication",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => "API_KEY",
    CURLOPT_HTTPHEADER => array(
      "accept: application/json",
      "cache-control: no-cache",
      "content-type: application/x-www-form-urlencoded",

    ),
  ));

  $response = curl_exec($curl);
  $err = curl_error($curl);

  curl_close($curl);

  if ($err) {
    echo "cURL Error #:" . $err;
  } else {



    $json = json_decode($response, true);
    $_SESSION["flatIconToken"] = $json['data']['token'];
    $_SESSION["flatIconTokenExpires"] = $json['data']['expires'];


    //  Making query Call to Flaticon API


  }
}

function getImages($token, $q, $page, $limit)
{

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => "https://api.flaticon.com/v2/search/icons/priority?q=" . $q . "&page=" . $page . "&limit=" . $limit,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => array(
      "accept: application/json",
      "authorization: Bearer " . $token,
      "cache-control: no-cache",
      "data: ?q=space",

    ),
  ));

  $response = curl_exec($curl);
  $err = curl_error($curl);

  curl_close($curl);

  if ($err) {
    echo "cURL Error #:" . $err;
  } else {
    $imageArray = json_decode($response, true);
    echo json_encode($imageArray['data']);
  }
}
