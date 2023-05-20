<?php ini_set("display_errors", 1);

require_once("functions.php");

if ($_SERVER["REQUEST_METHOD"] == "GET") {

    if (isset($_GET["albumId"], $_GET["reviewId"])) {

        $users = json_decode(file_get_contents("users.json"), true);
        $allReviewsOfAlbum = [];

        // go through all users
        foreach ($users as $key => $user) {
            
            // go through all review of user to save the ones that are on the right album.
            foreach ($user["albumData"]["reviews"] as $key => $review) {
                
                if ($review["albumId"] == $_GET["albumId"]) {

                    if ($review["reviewId"] == $_GET["reviewId"]) {
                        continue;
                    }
                    
                    $review["displayName"] = $user["userIdentity"]["displayName"];
                    $review["userId"] = $user["userIdentity"]["id"];
                    $review["profilePicture"] = $user["userIdentity"]["profilePic"];
                    $allReviewsOfAlbum[] = $review;
                }
            }

        }
        sendJSON($allReviewsOfAlbum);
    }
    sendJSON(["message" => "You need to include the parameter 'albumId'"], 400);
}

sendJSON(["message" => "You need to use the GET method"], 405);

?>