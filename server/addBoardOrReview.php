<?php
ini_set("display_errors", 1);
require_once("functions.php");
// Check if uploaded data is the type of review or board
// PHP mapp 1
if ($_POST) {
    // Check if input for board name was sent
    if (!isset($_POST["nameInput"]) && !isset($_POST["userId"])) {
            $response = ["message"=>"No input added"];
            sendJson($response, 405);
    }


        $boardName = $_POST["nameInput"];
        $userId = $_POST["userId"];
        $imageName = "";

        if (isset($_FILES["imageInput"]) && $_FILES["imageInput"]["tmp_name"] != "") {
            if ($_FILES["imageInput"]["size"] > 50000) {
                $response = ["message" => "Photo size too large king"];
                sendJSON($response, 200);
            }
            $source = $_FILES["imageInput"]["tmp_name"];
            $imageType = $_FILES["imageInput"]["type"];
            $uniqueImageName = time();
            // $ending = str_replace("image/", ".", $imageType);

            $path_parts = pathinfo($_FILES["imageInput"]["name"]);
            $ext = $path_parts["extension"];

            if (!in_array($ext, ["jpg", "png", "jpeg"])){
                sendJSON(["message" => "File type not allowed :/"]);
            }

            $imageName = "$uniqueImageName" . $ext;
            // $destination = (__DIR__) . "/media/usersMedia/$userId/boards/" . $imageName;
            $destination = "../media/usersMedia/$userId/boards/$imageName";
            // Fråga Sebbe wtf mannen
            if (!move_uploaded_file($source, $destination)) {
                $response = ["error" => "Failed to upload file"];
                sendJSON($response, 400);
            }
            
        }



        
        

        $userData = getFileData("users.json");
        foreach ($userData as $key => $user) {
            if ($user["userIdentity"]["id"] === $userId) {
                $usersBoards = $user["albumData"]["boards"];
                // Check if board name is already in use
                foreach ($usersBoards as $board) {
                    if ($board["boardName"] === $boardName) {
                        $response = ["message" => "A board with that name already exists"];
                        sendJSON($response, 400);
                    }
                }
                $boardId = getId($usersBoards, "boardId");
                
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
            $reviewId = getId($usersReviews, "reviewId");

            foreach ($usersReviews as $review) {
                if ($review["albumId"] == $albumId) {
                    $reviewsBoards = $review["boards"];
                    foreach ($reviewsBoards as $IdForboard) {
                        if ($IdForboard == $boardId) {
                            $response = ["message" => "You've already reviewed this album in this board"];
                            sendJSON($response, 200);
                        }
                    }
                }
            }


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
?>
