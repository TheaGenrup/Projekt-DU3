"use strict";

function followUnfollow(event) {

    const request = new Request("/server/follow.php", {
        headers: { "Content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({
            id: user.userIdentity.id,
            currentUserId: localStorage.userId
        }),
    });

    try {
        fetch(request)
            .then(response => {
                return response.json();
            })

    } catch (error) {
        console.log(error);
    }

    if (event.target.textContent === "Follow") {
        event.target.textContent = "Following";
    } else {
        event.target.textContent = "Follow";
    }

}