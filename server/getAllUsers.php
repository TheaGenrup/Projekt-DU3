<?php ini_set("display_errors", 1);

require_once("functions.php");

if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $usersData = file_get_contents("users.json");
    $users = json_decode($usersData, true);

    sendJSON($users);

}

sendJSON(["message" => "You need to use the GET method"], 405);

?>