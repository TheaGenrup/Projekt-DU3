<?php ini_set("display_errors", 1);

require_once "functions.php";


if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $users = json_decode(file_get_contents("users.json"), true);

    if (isset($_GET["id"])) {
        $userId = $_GET["id"];

        foreach ($users as $user) {

            // find the user
            if ($user["userIdentity"]["id"] == $userId) {
                
                $reviewsToSend = [];

                foreach ($user["albumData"]["reviews"] as $review) {
                    $reviewsToSend[] = [
                        "albumName" => $review["albumName"],
                        "timestamp" => $review["timestamp"],
                        "displayName" => $user["userIdentity"]["displayName"],
                        "artist" => $review["artist"],
                        "rating" => $review["rating"],
                        "reviewDescription" => $review["reviewDescription"],
                        "reviewId" => $review["reviewId"],
                        "albumCover" => $review["albumCover"]
                    ];
                };

                

                sendJSON($reviewsToSend);
            } 
        } 
        sendJSON(["message" => "User Not Found"], 404);
    }

} 
sendJSON(["message" => "You need to use the GET method"], 405);

?>