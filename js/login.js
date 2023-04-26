/*
const server = "login";
const request = new Request (`server/login.php`);
const data = {
    headers: {"Content-type": "application/json"},
    method: "POST",
    body: JSON.stringify({
        username: "test",
        password: "test",
        access: "Access-Login: Auth / Access-Key: Auth"
    })
}

fetch(request, data)
.then(r=>{
    console.log(r);
    return r.json()
})
.then(r => {
    console.log(r);
})

Om allt går bra returneras användaren och dess info förutom dess användarnamn & lösenord
*/