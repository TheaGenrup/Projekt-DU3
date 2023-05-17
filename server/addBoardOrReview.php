<?php
ini_set("display_errors", 1);
require_once("functions.php");
// Check if uploaded data is the type of review or board
if ($_POST) {
    // Check if input for board name was sent
    if (!isset($_POST["nameInput"]) && !isset($_POST["userId"])) {
            $response = ["message"=>"No input added"];
            sendJson($response, 405);
    }


        $boardName = $_POST["nameInput"];
        $userId = $_POST["userId"];
        $imageName = "defaultBoardImage.jpg";

        if (isset($_FILES["imageInput"]) && $_FILES["imageInput"]["tmp_name"] != "") {
            $source = $_FILES["imageInput"]["tmp_name"];
            $imageType = $_FILES["imageInput"]["type"];
            $uniqueImageName = time();
            $imageName = "$uniqueImageName" . "$imageType";
            $destination = __DIR__ . "/../media/usersMedia/$userId/boards/" . "$uniqueImageName" . "$imageType";
            // Fråga Sebbe wtf mannen
            if (!move_uploaded_file($source,$destination)) {
                $response = ["error" => "Failed to upload file"];
                sendJSON($response, 400);
            }
            
        }

        $userData = getFileData("users.json");
        foreach ($userData as $key => $user) {
            if ($user["userIdentity"]["id"] === $userId) {
                $usersBoards = $user["albumData"]["boards"];
                $boardId = getBoardId($usersBoards, 0);
                
                $newBoardObject = [
                    "boardName" => $boardName,
                    "boardId" => $boardId,
                    "reviews" => [],
                    "thumbnail" => "$imageName"
                ];
                
                $userData[$key]["albumData"]["boards"][] = $newBoardObject;
                saveFileData("users.json", $userData);
                $response = ["message" => "Board added!"];
                sendJSON($response, 200);
            }
        }

} else {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    if (!isset($data["userId"]) && isset($data["boardId"]) && isset($data["rating"]) && isset($data["albumName"]) && isset($data["artistName"])) {
        $response = ["message" => "Invlaid, missing inputs"];
        sendJSON($response, 405);
    }
    $userId = $data["userId"];
    $userData = getFileData("users.json");
    
    foreach ($userData as $key => $user) {
        if ($user["userIdentity"]["id"] == $userId) {
            $usersBoards = $user["albumData"]["boards"];
            $usersReviews = $user["albumData"]["reviews"];

            $albumName = $data["albumName"];
            $boardId = $data["boardId"];
            $artist =   $data["artistName"];
            $albumId =  $data["albumId"];
            $reviewDescription = $data["reviewDescription"];
            $rating = $data["rating"];
            $timestamp = time();
            $albumCover = $data["albumCover"];
            $reviewId = getReviewId($usersReviews, 0);

            $arrayWithBoards = [];
            $arrayWithBoards[] = $boardId;

            $newReviewObject = [
                "albumName" => $albumName,
                "artist" => $artist,
                "albumId" => $albumId,
                "reviewId" => $reviewId,
                "reviewDescription" => "$reviewDescription",
                "rating" => $rating,
                "boards" => $arrayWithBoards,
                "timestamp" => $timestamp,
                "albumCover" => $albumCover,
            ];
            

            foreach ($usersBoards as $keyBoard=> $board) {
                if ($board["boardId"] == $boardId) {
                     $userData[$key]["albumData"]["boards"][$keyBoard]["reviews"][] = $reviewId;
                    $userData[$key]["albumData"]["reviews"][] = $newReviewObject;
                    saveFileData("users.json", $userData);
                    $response = ["message" => "Review added!"];
                    sendJSON($response, 200);
                }
            }
            $error = ["message" => "Internal error: Issues with board"];
            sendJSON($error, 200);

        }

    }

};
function getReviewId($usersReviews, $id){
    foreach ($usersReviews as $key => $review) {
        if ($review["reviewId"] == $id) {
            $id++;
            getReviewId($usersReviews, $id);
        }
    }
    return $id;
}

function getBoardId($usersBoards, $id){
    foreach ($usersBoards as $key => $board) {
        if ($board["boardId"] == $id) {
            $id++;
            getBoardId($usersBoards, $id);
        }
    }
    return $id;
}

/*
    "albumName": "Och Stora Havet",
    "artist": "Jakob Hellman",
    "albumId": "5Bz2LxOp0wz7ov0T9WiRmc",
    "reviewId": 57,
    "reviewDescription": "SOOOO smooth sounding. even in its simplicity this album is SOOO amazing, and it's absolutely timeless. probably in my top 5 of all time.",
    "rating": 3,
    "boards": [
        0
    ],




    $test = ["test" => $_POST];
    sendJSON($test, 202);

            rating: rating,
            reviewDescription: reviewDescription,
            boardId: boardId,
            artistName: artistName,
            albumName: albumName,
            albumCover: albumCover,
            albumId: albumId,
            userId: userId,
            review: "review"

*/

/*

            $usersBoards = $user["albumData"]["boards"];
            $usersReviews = $user["albumData"]["reviews"];
            $test = ["test" => $userId];
            sendJSON($test, 503);

            $albumName = $data["albumName"];
            $boardId = $data["boardId"];
            $artist =   $data["artistName"];
            $albumId =  $data["albumId"];
            $reviewDescription = $data["reviewDescription"];
            $rating = $data["rating"];
            $timestamp = time();
            $albumCover = $data["albumCover"];
            $reviewId = getReviewId($usersReviews, 0);

            $arrayWithBoards = [];
            $arrayWithBoards[] = $boardId;
            $newReviewObject = [
                "albumName" => $albumName,
                "artist" => $artist,
                "albumId" => $albumId,
                "reviewId" => $reviewId,
                "reviewDescription" => "$imageName",
                "rating" => $rating,
                "boards" => $arrayWithBoards,
                "timestamp" => $timestamp,
                "albumCover" => $albumCover,
            ];

            foreach ($usersBoards as $key => $board) {
                if ($board["boardId"] == $boardId) {
                    $userData[$key]["albumData"]["boards"]["reviews"][] = $reviewId;
                    $userData[$key]["albumData"]["reviews"][] = $newReviewObject;
                }
            }

            
            $userData[$key]["albumData"]["boards"][] = $newBoardObject;
            saveFileData("users.json", $userData);
            sendJson($userData[$key]["albumData"]["boards"], 201);




*/

?>
