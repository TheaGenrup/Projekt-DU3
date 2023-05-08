<?php
function sendJSON($data, $statuscode = 200) {
    header("Content-Type: application/json");
    http_response_code($statuscode);
    $json = json_encode($data);
    echo $json;
    exit();
}
function fetchAndSaveToken() {
    $client_id = "e7847b3756ec4621a8cc7facddde226f";
    $client_secret = "e7d4266cbbbb486eb6f6318b2c46ca8a";
    $grant_type = "client_credentials";
    $auth = base64_encode("$client_id:$client_secret");

    $url = 'https://accounts.spotify.com/api/token';

    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n"
                    . "Authorization: Basic $auth\r\n",
            'method'  => 'POST',
            'content' => http_build_query(['grant_type' => $grant_type])
        ]
    ];
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    $data = json_decode($result, true);
    $data["timestamp"] = time();

    file_put_contents("token.json", json_encode($data, JSON_PRETTY_PRINT));

    if ($result === FALSE) { /* Handle error */ }
    
    return $data;
}

$token = "";
if (file_exists("token.json")) {
    $json = file_get_contents("token.json");
    $token_data = json_decode($json, TRUE);

    $expires = $token_data["expires_in"];
    
    $then = $token_data["timestamp"];
    $now = time();
    $timepassed = $now - $then;
    $timeLeft = $expires - $timepassed;

    if ($timepassed > $expires) {
        $token_data = fetchAndSaveToken();
        $token = $token_data["access_token"];
    } else {
        $token = $token_data["access_token"];
    }
}

$requestMethod = $_SERVER["REQUEST_METHOD"];
if ($requestMethod == "GET") {
    header("Content-Type: application/json");
    http_response_code(202);
    echo json_encode([
        "token" => $token,
        "tokenTimeLeft" => $timeLeft]
    );
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./test.css">
</head>
<body>

<main>
        
    </main>

    
    <script>
        let token = "<?php echo $token; ?>";
    </script>
    <script src="/server/spotify-api.js"></script>
    <script>

        /*
                    const searchEndpoint = 'https://api.spotify.com/v1/search?q=Milley&type=artist&offset=0&limit=20'; 
            const pitbullAlbumEndpoint = "https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg/albums";
        if (token.length > 0) { 
            fetch(searchEndpoint, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }).then(r => r.json()).then(console.log);
        }
        */
    </script>
</body>
</html>