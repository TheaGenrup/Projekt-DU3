<?php ini_set("display_errors", 1);

require_once "functions.php";


if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $userDatabase = json_decode(file_get_contents("users.json"), true);


    if (isset($_GET["id"])) {
        $userId = $_GET["id"];

        foreach ($userDatabase as $user) {

            // find the user
            if ($user["userIdentity"]["id"] == $userId) {
                
                sendJSON($user["albumData"]["reviews"]);
            } 
            sendJSON(["message" => "User Not Found"], 404);
        } 
    }

} 
sendJSON(["message" => "You need to use the GET method"], 405);

?>