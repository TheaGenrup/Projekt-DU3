<?php ini_set("display_errors", 1);

require_once("functions.php");

if (!$_SERVER["REQUEST_METHOD"] == "DELETE") {

    $error = ["message" => "Invalid HTTP-method"];
    sendJSON($error, 405);

} else {

    $json = file_get_contents("php://input");
    $inputData = json_decode($json, true);

    //hämtar alla users

    $filename = "users.json";
    $usersContent = file_get_contents($filename);
    $users = json_decode($usersContent, true);

    foreach ($users as $user) {
        if ($inputData["userId"] == $user["userIdentity"]["id"]) {
            
            $arrayWithReviews = $user["albumData"]["reviews"];
            
            foreach($arrayWithReviews as $index => $review) {
                if ($review["reviewId"] == $inputData["reviewId"]) {
                    unset($arrayWithReviews, $index);
                    sendJSON($review);
                }
            }
        }
    }


}


