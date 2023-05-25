<?php ini_set("display_errors", 1);
require_once "functions.php";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $users = getFileData("users.json");

    if (isset($_GET["id"])) {
        $userId = $_GET["id"];

        foreach ($users as $user) {

            // find the user
            if ($user["userIdentity"]["id"] == $userId) {                
                $reviewsToSend = [];

                foreach ($user["albumData"]["reviews"] as $review) {
                    $reviewsToSend[] = [
                        "albumName" => $review["albumName"],
                        "albumId" => $review["albumId"],
                        "timestamp" => $review["timestamp"],
                        "displayName" => $user["userIdentity"]["displayName"],
                        "userId" => $user["userIdentity"]["id"],
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
    if (isset($_GET["albumId"])) {
        $albumId = $_GET["albumId"];
        $users = getFileData("users.json");
        $reviewsCount = 0;
        $reviewRatingTotal = 0;
        $reviews = [];
        foreach ($users as $user) {
            $usersReivews = $user["albumData"]["reviews"];
            foreach ($usersReivews as $review) {
                if ($review["albumId"] == $albumId) {
                    $reviewRating = $review["rating"];
                    $reviewsCount++;
                    $reviewRatingTotal += $reviewRating;
                    $review["displayName"] = $user["userIdentity"]["displayName"];
                    $review["userId"] = $user["userIdentity"]["id"];
                    $review["userProfilePicture"] = $user["userIdentity"]["profilePicture"];
                    $reviews [] = $review;
                }
            }
        };
        if ($reviewsCount == 0) {
            $response = ["message" => "No rating score yet"];
            sendJSON($response, 200);
        }
        $averageRating = $reviewRatingTotal / $reviewsCount;
        $response = [
            "averageRating" => $averageRating,
            "totalReviews" => $reviewRatingTotal,
            "reviews" => $reviews
        ];
        sendJSON($response, 200);
    };
    $response = ["message" => "Missing get input"];
    sendJSON($response, 405);

} 
sendJSON(["message" => "You need to use the GET method"], 405);

?>