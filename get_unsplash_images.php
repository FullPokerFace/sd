<?php

$q = $_POST['q'];
$limit = $_POST['limit'];
$page = $_POST['page'];
$client_id = 'wOlrjf0v1ywd2962qij1dVyUVQ76IpbnzWC5ZR5aFf0';

function getImagesS($client_id, $q, $page, $limit)
{

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => "https://api.unsplash.com/search/photos?page=" . $page . "&per_page=" . $limit . "&query=" . $q,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => array(
      "accept-version: v1",
      "authorization: Client-ID " . $client_id,
      "cache-control: no-cache",
      "postman-token: a7131553-801a-4def-afe1-5cdd6302ffe5"
    ),
  ));

  $response = curl_exec($curl);
  $err = curl_error($curl);

  curl_close($curl);

  if ($err) {
    echo "cURL Error #:" . $err;
  } else {

    $imageArray = json_decode($response, true);
    echo json_encode($imageArray['results']);
  }
}

getImagesS($client_id, $q, $page, $limit);
