<?php
// Ändraingar:
// Description
// rating


$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (!isset($data["userId"]) && isset($data["boardId"]) && isset($data["newRating"]) && isset($data["newDescription"])) {
    $response = ["message" => "Invlaid, missing inputs"];
    sendJSON($response, 405);
}



?>