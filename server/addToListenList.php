<?php
require_once("functions.php");

$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (!isset($data["userId"]) && isset($data["album"])) {
    $response = ["message" => "Invlaid, missing inputs"];
    sendJSON($response, 405);
}
$userId = $data["userId"];
$userData = getFileData("users.json");

foreach ($userData as $key => $user) {
    if ($user["userIdentity"]["id"] == $userId) {
        $usersfavourites = $user["albumData"]["favourites"];
        $album = $data["album"];
        $albumName = $album["albumName"];
        $artist =   $album["artist"][0];
        $albumId =  $album["albumId"];
        $albumCover = $album["albumCover"];

        
        
        foreach ($usersfavourites as $listKey => $favourite) {
            if ($favourite["albumId"] == $albumId) {
                $updatedList = removeItemfromArray($usersfavourites, $albumId, "albumId");
                $userData[$key]["albumData"]["favourites"] = $updatedList;
                saveFileData("users.json", $userData);
                $response = ["message" => "success"];
                sendJSON($response, 202);
            }
        }

        $favouriteId = getFavouritesId($usersfavourites, 0);
        $newFavouritesObject = [
            "albumName" => $albumName,
            "artist" => $artist,
            "albumId" => $albumId,
            "albumCover" => $albumCover,
            "favouriteId" => $favouriteId,
            "timestamp" => time()
        ];

        $userData[$key]["albumData"]["favourites"][] = $newFavouritesObject;
        saveFileData("users.json", $userData);
        $response = ["message" => "success"];
        sendJSON($response, 200);

    }
}
$error = ["message" => "Internal error: Issues with users"];
sendJSON($error, 200);

function getFavouritesId($usersfavourites, $id){
    foreach ($usersfavourites as $key => $favourite) {
        if ($favourite["favouriteId"] == $id) {
            $id++;
            getFavouritesId($usersfavourites, $id);
        }
    }
    return $id;
}


?>