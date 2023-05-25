<?php
require_once("functions.php");
$requestMethod = $_SERVER["REQUEST_METHOD"];
// Update users display name
if ($requestMethod != "POST" && $requestMethod != "PATCH") {
    $error = ["message" => "Invalid method"];
    sendJSON($error, 405);
}

if ($requestMethod == "POST") {
    if (isset($_FILES["imageInput"]) && $_FILES["imageInput"]["tmp_name"] != "") {
        $userData = getFileData("users.json");
        $userId = $_POST["userId"];

        foreach ($userData as $key => $user) {
            if ($user["userIdentity"]["id"] === $userId) {
                if ($_FILES["imageInput"]["size"] > 2000000) {
                    $response = ["message" => "Photo size too large king"];
                    sendJSON($response, 400);
                }
                $path_parts = pathinfo($_FILES["imageInput"]["name"]);
                $ext = $path_parts["extension"];
    
                if (!in_array($ext, ["jpg", "png", "jpeg"])){
                    sendJSON(["message" => "File type not allowed :/"]);
                }
                $source = $_FILES["imageInput"]["tmp_name"];
                $imageType = $_FILES["imageInput"]["type"];
                $ending = str_replace("image/", ".", $imageType);
                $username = $user["userCredentials"]["username"];
                $imageName = $username . $ext;
                $destination = "../media/usersMedia/$userId/$imageName";
                $userData[$key]["userIdentity"]["profilePic"] = $imageName ;



                $usersCurrentProfilePicture = $user["userIdentity"]["profilePic"];
                if ($user["userIdentity"]["profilePic"] != "") {
                    unlink("../media/usersMedia/$userId/$usersCurrentProfilePicture");
                }
                if (move_uploaded_file($source, $destination)) {
                    $userData[$key]["userIdentity"]["profilePic"] = $imageName ;
                    saveFileData("users.json", $userData);
                    $response = ["message" => "Profile updated"];
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
    if (str_contains($data["newDisplayName"], " ")) { $response = ["message"=>"Cannot include spaces :("];    sendJson($response, 400);}


    $newDisplayName = $data["newDisplayName"];
    $userData = getFileData("users.json");

    foreach ($userData as $key => $user) {
        if ($user["userIdentity"]["id"] === $userId) {
            if ($user["userIdentity"]["displayName"] == $newDisplayName) {    $response = ["message" => "Display already in use!"];    sendJson($response, 200);    };
                $userData[$key]["userIdentity"]["displayName"] = $newDisplayName;
                saveFileData("users.json", $userData);
                $response = ["message" => "Profile updated"];
                sendJson($response, 202);
        }
    }

}
?>
