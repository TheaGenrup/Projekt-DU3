<?php
require_once("functions.php");
$requestMethod = $_SERVER["REQUEST_METHOD"];
//  Check if method is POST
if ($requestMethod != "GET") {
    $error = ["message" => "Invalid method"];
    sendJSON($error, 405);
}
// Check if we actually sent a search input
if (!isset($_GET["search"])) {
    $error = ["message" => "Missing search input"];
    sendJSON($error, 400);
};
$input = $_GET["search"];
$possibleMatches = [];

$userData = getFileData("users.json");
foreach ($userData as $key => $user) {
    $displayName = $user["userIdentity"]["displayName"];
    $displayNameLowerCase = strtolower($displayName);
    $inputLowerCase = strtolower($input);

    if (str_contains($displayNameLowerCase, $inputLowerCase) == true) {
        $id = $user["userIdentity"]["id"];
        $profilePicture = $user["userIdentity"]["profilePic"];
        $userObject = [
            "displayName" => $displayName,
            "id" => $id,
            "profilePicture" => $profilePicture
        ];
        $possibleMatches[] = $userObject;
    }
}

if (count($possibleMatches) == 0) {
    $response = ["users" => "No users found"];
    sendJSON($response);
} else {
    $matches = array_splice($possibleMatches, 0, 5);
    sendJson($matches);
    
}


?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>