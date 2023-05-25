<?php ini_set("display_errors", 1);

require_once("functions.php");
//  Check if content type is application/json
$contentType = $_SERVER["CONTENT_TYPE"];
if ($contentType != "application/json") {
    sendJSON(["message" => "invalid Content-Type, $contentType"], 415);
}

if (!$_SERVER["REQUEST_METHOD"] == "DELETE") {
    $error = ["message" => "Invalid HTTP-method"];
    sendJSON($error, 405);

} else {

    $inputData = getFileData("php://input");

    //hämta alla users
    $users = getFileData("users.json");

    foreach ($users as $keyUser => $user) {
        if ($inputData["userId"] == $user["userIdentity"]["id"]) {
   
            $newArrayReviewIds = [];

            foreach ($user["albumData"]["boards"] as $keyBoard => $board) {

                foreach ($user["albumData"]["boards"][$keyBoard]["reviews"] as $keyReview => $reviewId) {
                    if ($reviewId != $inputData["reviewId"]) {
                        $newArrayReviewIds[] = $reviewId;
                    }
                }
                $users[$keyUser]["albumData"]["boards"][$keyBoard]["reviews"] = $newArrayReviewIds;
            }



            $newArrayReviews = [];

            foreach ($user["albumData"]["reviews"] as $keyReview => $review) {
                if ($review["reviewId"] != $inputData["reviewId"]) {
                    $newArrayReviews[] = $user["albumData"]["reviews"][$keyReview];
                }
            }
            $users[$keyUser]["albumData"]["reviews"] = $newArrayReviews;


        }
    }

    saveFileData("users.json", $users);


}

?>
