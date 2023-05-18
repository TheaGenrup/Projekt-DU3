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

// User Register input
$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (!isset($data["id"], $data["currentUserId"])) {
    $error = ["message" => "Missing ids"];
    sendJson($error, 400);
}


$currentUserId = $data["currentUserId"];
$sentId = $data["id"];
$userData = getFileData("users.json");
// Follow user

foreach ($userData as $key => $user) {

    if ($user["userIdentity"]["id"] == $currentUserId) {

        // find the logged in user
        $usersFollowing = $user["userSocial"]["following"];
        if (in_array($sentId, $usersFollowing)) {
            foreach ($usersFollowing as $index => $followedId) {
                if ($followedId == $sentId) {
                    unset($usersFollowing[$index]);
                }
            }
        } else {
            $userdata[$key]["userSocial"]["following"][] = $sentId;
        }
        saveFileData("users.json", $userData);
    }

        // find the viewed user
    if ($user["userIdentity"]["id"] == $sentId) {
        $usersFollowers = $user["userSocial"]["followers"];
        if (in_array($currentUserId, $usersFollowers)) {
            foreach ($usersFollowers as $index => $followedId) {
                if ($followedId == $currentUserId) {
                    unset($usersFollowers[$index]);
                }
            }
        } else {
            $usersFollowers[] = $currentUserId;
        }
        $userData[$key]["userSocial"]["followers"] = $usersFollowers;
        saveFileData("users.json", $userData);
    }
}


$message = ["message" => "success"];
sendJSON($message, 200);

?>