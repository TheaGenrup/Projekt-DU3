<?php
ini_set("display_errors", 1);
require_once("functions.php");
// Check if input for board name was sent
if (!isset($_POST["nameInput"]) && !isset($_POST["userId"])) {
    $response = ["message"=>"No input added"];
    sendJson($test, 405);
}
$boardName = $_POST["nameInput"];
$userId = $_POST["userId"];
$image = "defaultBoardImage.jpg";







if (isset($_FILES["imageInput"])) {
    $source = $_FILES["imageInput"]["tmp_name"];
    $imageType = $_FILES["imageInput"]["type"];
    $uniqueNaming = time();
    $destination = "/media/usersMedia/$userId/boards/" . "$uniqueImageName.jpeg";
    if (move_uploaded_file($source,$destination)) {
        sendJson($destination, 207);
    }
    sendJson($uniqueImageName,202);
}












$userData = getFileData("users.json");

foreach ($userData as $key => $user) {
    if ($user["userIdentity"]["id"] === $userId) {
        $usersBoards = $user["albumData"]["boards"];
        $id = getBoardId($usersBoards, 0);
        
        $newBoardObject = [
            "boardName" => $boardName,
            "boardId" => $id,
            "reviews" => [],
            "thumbnail" => $image
        ];
        
        $userData[$key]["albumData"]["boards"][] = $newBoardObject;
        saveFileData("users.json", $userData);
        sendJson($userData[$key]["albumData"]["boards"], 201);
    }
}

function getBoardId($usersBoards, $id){
    foreach ($usersBoards as $key => $board) {
        if ($board["boardId"] === $id) {
            $id++;
            getBoardId($usersBoards, $id);
        }
    }
    return $id;
}

?>
