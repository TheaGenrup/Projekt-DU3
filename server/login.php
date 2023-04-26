<?php
require_once("functions.php");

$requestMethod = $_SERVER["REQUEST_METHOD"];




//  Check if method is POST
if ($requestMethod != "POST") {
    $error = ["message" => "Invalid method"];
    sendJSON($error, 405);
}

//  Check if content type is application/json
$contentType = $_SERVER["CONTENT_TYPE"];
if ($contentType != "application/json") {
    sendJSON(["message" => "invalid Content-Type, $contentType"], 406);
}

// User login input
$json = file_get_contents("php://input");
$data = json_decode($json, true);
if (isset($data["username"], $data["password"])) {
    
    if (isset($data["acess"]) || $data["access"] == "Access-Login: Auth") {
        $sentUsername = $data["username"];
        $sentPassword = $data["password"];
        if ($sentUsername == "" || $sentPassword == "") {
            $error = ["message" => "Empty username or password"];
            sendJSON($error, 400);
        }

        $userData = getFileData("users.json");
        foreach ($userData as $index => $user) {
            $password = $user["userCredentials"]["password"];
            $username = $user["userCredentials"]["username"];
            if ($sentUsername == $username && $sentPassword == $password) {
                $key = getValidatedkey();
                $user["loginKey"] = $key;
                $userData[$index] = $user;
                $foundUser = $user;
                saveFileData("users.json", $userData);
                unset($foundUser["userCredentials"]);
                sendJSON($foundUser, 200);
            }
        }
        $message = ["message" => "Incorrect Username or password"];
        sendJSON($message, 400);
    }

    $error = ["message" => "Authentication failed"];
    sendJSON($error, 400);
}

if (isset($data["loginTokenKey"]) && isset($data["access"])) {
    if ($data["access"] != "Access-Key: Auth") {
        $error = ["message" => "Authentication failed"];
        sendJSON($error, 400);
    }
    
    $userData = getFileData("users.json");
    foreach ($userData as $index => $user) {
        $loginKey = $user["loginKey"];
        $sentKey = $data["loginTokenKey"];
        if ($sentKey === $loginKey) {
            $key = getValidatedkey();
            $user["loginKey"] = $key;
            $userData[$index] = $user;
            $foundUser = $user;
            saveFileData("users.json", $userData);
            unset($foundUser["userCredentials"]);
            sendJSON($foundUser, 200);
        }
}
}

?>