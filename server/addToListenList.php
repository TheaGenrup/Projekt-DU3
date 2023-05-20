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
        $artist =   $album["albumArtists"][0];
        $albumId =  $album["albumId"];
        $albumCover = $album["albumImage"];
        

        $newFavouritesObject = [
            "albumName" => $albumName,
            "artist" => $artist,
            "albumId" => $albumId,
            "albumCover" => $albumCover,
            "favouriteId" => $favouriteId
        ];

        
        foreach ($usersfavourites as $key => $favourites) {
            if ($favourites["albumId"] == $albumId) {
                $response = ["message" => "Favorites already added"];
                sendJSON($response, 202);
            }
        }

        $userData[$key]["albumData"]["favourites"][] = $newFavouritesObject;
        saveFileData("users.json", $userData);
        $response = ["message" => "Favorites added"];
        sendJSON($response, 200);

    }
    $error = ["message" => "Internal error: Issues with users"];
    sendJSON($error, 200);
}

function getFavouritesId($usersfavourites, $id){
    if (count($usersfavourites) == 0) {    return $id; }
    foreach ($usersfavourites as $key => $favourite) {
        if ($favourite["favouriteId"] == $id) {
            $id++;
            getFavouritesId($usersfavourites, $id);
        }
    }
    return $id;
}



?>