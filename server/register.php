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
    sendJSON(["message" => "invalid Content-Type, $contentType"], 415);
}

// User Register input
$json = file_get_contents("php://input");
$data = json_decode($json, true);
if (isset($data["username"], $data["password"], $data["displayName"])) {
    
    //Check if neccessary access keys have been sent
    if (isset($data["acess"]) || $data["access"] == "Access-Register: Auth") {
        $sentUsername = $data["username"];
        $sentPassword = $data["password"];
        $sentDisplayName = $data["displayName"];
        if ($sentUsername == "" || $sentPassword == "" || $sentDisplayName == "") {
            $error = ["message" => "Please leave no field empty <3"];
            sendJSON($error, 400);
        }
        if (strstr($sentUsername, " ") || strstr($sentPassword, " ") || strstr($sentDisplayName, " ")) {
            $error = ["message" => "Inputs may not contain spaces"];
            sendJSON($error, 400);
        }

        if (strlen($sentUsername) > 25) {
            $error = ["message" => "Username may not be longer than 25 characters"];
            sendJSON($error, 400);
        }
        if (strlen($sentPassword) > 30) {
            $error = ["message" => "Password may not be longer than 30 characters"];
            sendJSON($error, 400);
        }
        if (strlen($sentDisplayName) > 25) {
            $error = ["message" => "DisplayName may not be longer than 25 characters"];
            sendJSON($error, 400);
        }

        $userData = getFileData("users.json");
        // Check if user credentials are already in use;
        foreach ($userData as $index => $user) {
            $password = $user["userCredentials"]["password"];
            $username = $user["userCredentials"]["username"];
            $displayName = $user["userIdentity"]["displayName"];
            if ($sentUsername == $username) {
                $error = ["message" => "Username already in use"];
                sendJSON($error, 400);
            }
            if ($sentPassword == $password) {
                $error = ["message" => "Password already in use"];
                sendJSON($error, 400);
            }
            if ($sentDisplayName == $displayName) {
                $error = ["message" => "Name already in use"];
                sendJSON($error, 400);
            }
        }
        // Generate unique user id
        $id = false;
        while ($id == false) {
            $id = generateUserId();
            foreach ($userData as $key => $user) {
                if ($id == $user["userIdentity"]["id"]) {
                    $id = false;
                }
            }
        }
        if ($id == false) {
            $error = ["message" => "We're very sorry to inform you that we have an internal server issue :( We will resolve this as soon as possible! Please try in again in a moment"];
            sendJSON($error, 500);
        }
        // New user object
        $newUser = [
            "userCredentials" => [
                  "username" => "$sentUsername", 
                  "password" => "$sentPassword" 
               ], 
            "loginKey" => "", 
            "userSocial" => [
                     "following" => [], 
                     "followers" => [] 
                  ], 
            "userIdentity" => [
                              "id" => "$id", 
                              "profilePicture" => "", 
                              "displayName" => "$sentDisplayName" 
                           ], 
            "albumData" => [
                "boards" => [],
                "reviews" => [],
                "favourites" => [] 
            ]
        ]; 
        if (!file_exists("../media/usersMedia/$id")) {
            if (!mkdir("../media/usersMedia/$id", 0777, true)) {
                $response = [
                    "message" => "failed to register",
                    "error" => "User dir"
                ];
                sendJSON($response, 400);
            }
            if (!mkdir("../media/usersMedia/$id/boards", 0777, true)) {
                $response = [
                    "message" => "failed to register",
                    "error" => "User boards"
                ];
                sendJSON($response, 400);
            }
        }


          
        $userData[] = $newUser;
        saveFileData("users.json", $userData);
        $message = ["message" => "Registered!"];
        sendJSON($message, 202);

    }

    $error = ["message" => "Authentication failed"];
    sendJSON($error, 401);
}
?>