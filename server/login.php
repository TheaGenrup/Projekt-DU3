<?php
require_once("funktioner.php");
$requestMethod = $_SERVER["REQUEST_METHOD"];

//  Check if method is POST
if ($requestMethod != "POST") {
    $error = ["message" => "Invalid method"];
    sendJSON($error, 405);
}

//  Check if content type is application/json
$contentType = $_SERVER["CONTENT_TYPE"];
if ($contentType != "application/json") {
    sendJSON(["message" => "invalid Content-Type"], 406);
}

$json = file_get_contents("php://input");
$data = json_decode($json, true);
if (!isset($data["username"], $data["password"])) {
    $error = ["message" => "Missing login arguments"];
    sendJSON($error, 400);
}

$sentUserName = $data["username"];
$sentPassword = $data["password"];
if ($sentUserName == "" || $sentPassword == "") {
    $error = ["message" => "Empty username or password"];
    sendJSON($error, 400);
}

$userFilename = "users.json";
if (!file_exists($user_filename)) {
    $error = ["message" => "Technical difficulties :/"];
    sendJSON($error, 409);
}
$json_users = file_get_contents($user_filename);
$usersData = json_decode($json_users, true);

foreach ($userData as $key => $user) {
    $password = $user["userCredentials"]["password"];
    $userName = $user["userCredentials"]["userName"];
    if ($sentUserName == $userName && $sentPassword == $password) {
        $user["loginKey"] = getValidatedkey();
        $userData[$key] = $user;
        saveFileData("users.json", $userData);
        sendJSON($user);
    }
}



$message = ["message" => "Incorrect Username or password"];
sendJSON($message, 401)
?>