
const server = "login";
const request = new Request (`server/follow.php`);
const data = {
    headers: {"Content-type": "application/json"},
    method: "POST",
    body: JSON.stringify({
        currentUserId: "3",
        id: "607133432034891031030642696328",
        followUnfollow: "follow"
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
