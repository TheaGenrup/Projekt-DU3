<?php ini_set("display_errors", 1);

require_once("functions.php");

if (!$_SERVER["REQUEST_METHOD"] == "DELETE") {

    $error = ["message" => "Invalid HTTP-method"];
    sendJSON($error, 405);

} else {
     $inputData = getFileData("php://input");
    //hämta alla users
    $users = getFileData("users.json");
    foreach ($users as $key => $user) {
        if ($inputData["userId"] == $user["userIdentity"]["id"]) {
   
            $arrayWithReviews = $user["albumData"]["reviews"];
            removeItemFromArray($arrayWithReviews, $inputData["reviewId"], "reviewId");
            
            foreach ($user["albumData"]["boards"] as $key => $board) {
                removeItemFromArray($board["reviews"], $inputData["reviewId"], "$key");
            }
              
            // $user["albumData"]["reviews"] = $arrayWithReviews;
            $users[$key]["albumData"]["reviews"] = $arrayWithReviews;
        }
    }


    saveFileData("users.json", $users);


}

?>
