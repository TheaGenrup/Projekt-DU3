<?php
require_once("functions.php");
$requestMethod = $_SERVER["REQUEST_METHOD"];
//  Check if method is POST
if (!isset($_POST["userId"])) {
    $response = ["message"=>"Id needed"];
    sendJson($response, 405);
}

$userId = $_POST["userId"];
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


    
}
?>