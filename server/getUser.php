<?php
require_once("functions.php");

if ($_SERVER["REQUEST_METHOD"] != "GET") {
    $error = ["message" => "Invalid HTTP-method"];
    sendJSON($error, 405);
} 
if (!isset($_GET["id"])) {
    $error = ["message" => "Missing id input key"];
    sendJSON($error, 400);
}
$users = getFileData("users.json");
$userID = $_GET["id"];

foreach ($users as $user) {
    if($userID == $user["userIdentity"]["id"]) {
        unset($user["userCredentials"]);
        sendJSON($user);
    }
}

sendJSON(["message" => "You need to use the GET method"], 405);
?>