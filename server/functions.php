<?php
function sendJSON($data, $statuscode = 200) {
    header("Content-Type: application/json");
    http_response_code($statuscode);
    $json = json_encode($data);
    echo $json;
    exit();
}


function getFileData ($filename) {
    $json = file_get_contents($filename);
    $data = json_decode($json, true);
    return $data;
}

function saveFileData ($filename, $data) {
    $json = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents($filename, $json);
}

function getValidatedkey () {
    $key = generateLoginKey();
    $userData = getFileData("users.json");
    foreach ($userData as $user) {
        if ($user["loginKey"] == $key) {
            getValidatedkey();
        }
    }
    return $key;
}


function generateLoginKey () {
    $key = "";
    $characters = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    for ($i=0; $i < 25; $i++) { 
        $n = rand(0, strlen($characters)-1);
        $key .= $characters[$n];
        
    }
    return $key;
}

function clog($data) {
    echo "<pre>";
    var_dump($data);
    echo "</pre>";
}
?>