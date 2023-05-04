<?php ini_set("display_errors", 1);

if (!$_SERVER["REQUEST_METHOD"] == "GET") {

    $error = ["message" => "Invalid HTTP-method"];
    sendJSON($error, 405);

} else {

    $filename = "users.json";

    $usersContent = file_get_contents($filename);
    $users = json_decode($usersContent, true);

    $userID = $_GET["id"];

    foreach ($users as $user) {
        if($userID == $user["userIdentity"]["id"]) {
            unset($user["userCredentials"]["password"]);
            sendJSON($user);
        }
    }
}



?>