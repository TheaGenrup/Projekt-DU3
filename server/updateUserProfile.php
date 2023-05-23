<?php
require_once("functions.php");
$requestMethod = $_SERVER["REQUEST_METHOD"];
// Update users display name

if ($requestMethod == "POST") {
    if (isset($_FILES["imageInput"]) && $_FILES["imageInput"]["tmp_name"] != "") {
        $userData = getFileData("users.json");
        $userId = $_POST["userId"];

        foreach ($userData as $key => $user) {
            if ($user["userIdentity"]["id"] === $userId) {
                if ($_FILES["imageInput"]["size"] > 50000) {
                    $response = ["message" => "Photo size too large king"];
                    sendJSON($response, 200);
                }
                $source = $_FILES["imageInput"]["tmp_name"];
                $imageType = $_FILES["imageInput"]["type"];
                $ending = str_replace("image/", ".", $imageType);
                $username = $user["userCredentials"]["username"];
                $imageName = $username . $ending;
                $destination = "../media/usersMedia/$userId/$imageName";
                $userData[$key]["userIdentity"]["profilePic"] = $imageName ;


                $usersCurrentProfilePicture = $user["userIdentity"]["profilePic"];
                if ($user["userIdentity"]["profilePic"] != "") {
                    unlink("../media/usersMedia/$userId/$usersCurrentProfilePicture");
                }
                if (move_uploaded_file($source, $destination)) {
                    $userData[$key]["userIdentity"]["profilePic"] = $imageName ;
                    saveFileData("users.json", $userData);
                    $response = ["error" => "Profile picture updated"];
                    sendJSON($response, 200);
                };
            
    
            }
        }
    } 
}



if ($requestMethod == "PATCH") {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);
    $userId = $data["userId"];
    if (!isset($data["userId"])) {    $response = ["message"=>"Id needed"];    sendJson($response, 405);    }
    if (!isset($data["newDisplayName"])) { $response = ["message"=>"missing new name input"];    sendJson($response, 400);}


    $newDisplayName = $data["newDisplayName"];
    $userData = getFileData("users.json");

    foreach ($userData as $key => $user) {
        if ($user["userIdentity"]["id"] === $userId) {
            if ($user["userIdentity"]["displayName"] == $newDisplayName) {    $response = ["message" => "Display already in use!"];    sendJson($response, 200);    };
                $userData[$key]["userIdentity"]["displayName"] = $newDisplayName;
                saveFileData("users.json", $userData);
                $response = ["message"=>"Display name changed! "];
                sendJson($response, 202);
        }
    }

}



/*

$json = file_get_contents("php://input");
$data = json_decode($json, true);
if (!isset($data["id"])) {
    $response = ["message"=>"Id needed"];
    sendJson($response, 405);
}
$userId = $data["id"];
// Update users display name
if ($requestMethod == "PATCH") {
    if (!isset($data["newDisplayName"])) { $response = ["message"=>"missing new name input"];    sendJson($response, 400);}


    $newDisplayName = $data["newDisplayName"];
    $userData = getFileData("users.json");

    foreach ($userData as $user) {
        if ($user["userIdentity"]["displayName"] == $newDisplayName) {
            $response = ["message" => "Display already in used!"];
            sendJson($response, 200);
        }
    }

    foreach ($userData as $key => $user) {
        if ($user["userIdentity"]["id"] == $userId) {
            
            $userData[$key]["userIdentity"]["displayName"] = $newDisplayName;
            saveFileData("users.json", $userData);
            $response = ["message"=>"Display name changed! "];
            sendJson($response, 200);
        }
    }
}












// Update profile picture

$imageName;

if (isset($_FILES["imageInput"]) && $_FILES["imageInput"]["tmp_name"] != "") {
    $source = $_FILES["imageInput"]["tmp_name"];
    $imageType = $_FILES["imageInput"]["type"];
    $newProfilePictureName = "profilePicture" . "$imageType";
    $destination = __DIR__ . "/../media/usersMedia/$userId/profilePicture";
    if (!move_uploaded_file($source,$destination)) {
        $response = ["error" => "Failed to upload file"];
        sendJSON($response, 400);
    };

    $userData = getFileData("users.json");
    foreach ($userData as $key => $user) {
        if ($user["userIdentity"]["id"] === $userId) {

            $userData[$key]["userIdentity"]["profilePic"][] = $newProfilePictureName ;
            saveFileData("users.json", $userData);
            $response = ["message" => "userUpdated!"];
            sendJSON($response, 200);
        }
    }


$response = ["message"=> "Wrong Method noob"];
sendJson($response, 405);

    
}
*/
?>