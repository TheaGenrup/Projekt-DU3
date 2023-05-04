<?php
require_once("functions.php");
$requestMethod = $_SERVER["REQUEST_METHOD"];
//  Check if method is POST
if ($requestMethod != "GET") {
    $error = ["message" => "Invalid method"];
    sendJSON($error, 405);
}
$input = $_GET["search"];
// Check if we actually sent a search input

if (!isset($_GET["search"])) {
    $error = ["message" => "Missing search input"];
    sendJSON($error, 400);
};
$possibleMatches = [];
$inputLength = strlen($input);
for ($i=0; $i < $inputLength; $i++) { 
    $keyPriority = $inputLength - $i;
    $keyWord = substr($input, 0, $keyPriority);
    $possibleMatches[] = $inputMatchObject = [
        "keyWord" => $keyWord,
        "wordPriority" => $keyPriority,
        "displayNamesMatchingInput" => []
    ];
}
//$possibleMatches[0]["displayNamesMatchingInput"][] = "test";
//$possibleMatches[0]["displayNamesMatchingInput"][] = "test2";

$userData = getFileData("users.json");
foreach ($possibleMatches as $key => $inputMatchObject) {
    $keyWord = $inputMatchObject["keyWord"];
    foreach ($userData as $key => $user) {
        $displayName = $user["userIdentity"]["displayName"];
        
        if (str_contains($displayName, $keyWord)) {
            $inputMatchObject["displayNamesMatchingInput"][] = $user;
        }
    }
}
clog($possibleMatches);


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