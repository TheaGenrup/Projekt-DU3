<?php ini_set("display_errors", 1);

require_once("functions.php");

if (!$_SERVER["REQUEST_METHOD"] == "DELETE") {

    $error = ["message" => "Invalid HTTP-method"];
    sendJSON($error, 405);

} else {

    $inputData = getFileData("php://input");

    //hämtar alla users

    $users = getFileData("users.json");

    foreach ($users as $key => $user) {
        if ($inputData["userId"] == $user["userIdentity"]["id"]) {
            
            $arrayWithReviews = $user["albumData"]["reviews"];
            
            foreach($arrayWithReviews as $index => $review) {
                if ($review["reviewId"] == $inputData["reviewId"]) {
                    unset($arrayWithReviews[$index]);
                    //sendJSON($review);
                }
            }

            // $user["albumData"]["reviews"] = $arrayWithReviews;
            $users[$key]["albumData"]["reviews"] = $arrayWithReviews;
        }
    }

    saveFileData("users.json", $users);


}

?>
