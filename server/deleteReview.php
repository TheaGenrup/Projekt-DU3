<?php ini_set("display_errors", 1);

require_once("functions.php");

if (!$_SERVER["REQUEST_METHOD"] == "DELETE") {

    $error = ["message" => "Invalid HTTP-method"];
    sendJSON($error, 405);

} else {

    $inputData = getFileData("php://input");

    //hämta alla users
    $users = getFileData("users.json");

    foreach ($users as $keyUser => $user) {
        if ($inputData["userId"] == $user["userIdentity"]["id"]) {
   
            $arrayWithReviews = $user["albumData"]["reviews"];


                 //   removeItemFromArray($arrayWithReviews, $inputData["reviewId"], $keyReview);

            $updatedReviewArray = [];
            foreach ($arrayWithReviews as $key => $review) {
                if ($review["reviewId"] != $inputData["reviewId"]){  $updatedReviewArray[] = $review;  }
            }

            $users[$keyUser]["albumData"]["reviews"] = $updatedReviewArray;

            $updatedReviewIdArray = [];
            foreach ($user["albumData"]["boards"] as $keyBoard => $board) {
            //    removeItemFromArray($board["reviews"], $inputData["reviewId"], $key);
                foreach ($user["albumData"]["boards"][$keyBoard]["reviews"] as $keyReviewId => $reviewId) {
                    
                    if ($reviewId != $inputData["reviewId"]){  $updatedReviewIdArray[] = $reviewId;  }
                }
                $users[$keyUser]["albumData"]["boards"][$keyBoard]["reviews"] = $updatedReviewIdArray;
            }

            
/*             // $user["albumData"]["reviews"] = $arrayWithReviews; */
/*             $users[$key]["albumData"]["reviews"] = $arrayWithReviews; */


        }
    }

    saveFileData("users.json", $users);


}

?>
