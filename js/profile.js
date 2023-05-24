"use strict";

async function editAccount(e) {
    const userId = localStorage.getItem("userId");
    const user = await getUserData(userId);
    const overlay = document.createElement("div");
    overlay.classList.add("overlayReview");
    overlay.classList.add("editContainer");
    overlay.innerHTML = "";
    let html = `
    <div id="title">Edit your profile</div>
        <form id="uploadWrapper">
            <div id="imageUploaderContainer">
                <img id="imagePreview" src=""></img>
                <input type="file" id="imageUploader" accept="image/jpeg" name="imageInput">
                <input name="userId" style="display:none" value="${userId}">
            </div>
            <div id="displayNameContainer">
                <label for="displayNameInput"></label>
                <input type="text" id="searchField" name="displayNameInput" placeholder="Display Name" autocomplete="off">
            </div>
        </form>

        <div class="horizontalContainer">
        <button id="goBackButton" class="navigationButton">Cancel</button>
        <button for="uploadWrapper" id="createButton" class="navigationButton disabled">Save</button>
        </div>
    `
    overlay.innerHTML = html
    document.querySelector("main").append(overlay);
    const imageUploader = document.querySelector("#imageUploader");
    const imagePreview = document.querySelector("#imagePreview");
    const backButton = document.querySelector("#goBackButton");
    const createButton = document.querySelector("#createButton");
    const displayNameInput = document.querySelector("#searchField");
    const usersCurrentProfielPicture = user.userIdentity.profilePic;
    createButton.addEventListener("click", (e) => { e.preventDefault() });
    backButton.addEventListener("click", () => {
        overlay.remove();
    })

    if (user.userIdentity.profilePic === "") {
        imagePreview.style.backgroundImage = `url(/media/default.png)`;
    } else {
        imagePreview.style.backgroundImage = `url(/media/usersMedia/${userId}/${usersCurrentProfielPicture})`;
    }
    imageUploader.onchange = evt => {
        const [file] = imageUploader.files;
        if (file) {
            imagePreview.classList.add("imageUploaded");
            imagePreview.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
            createButton.classList.remove("disabled");
            createButton.addEventListener("click", editProfile);
        }
    };
    displayNameInput.addEventListener("keyup", (e) => {
        if (!displayNameInput.value && !imagePreview.classList.contains("imageUploaded")) {
            createButton.classList.add("disabled");
            createButton.removeEventListener("click", editProfile);
        } else {
            createButton.classList.remove("disabled");
            createButton.addEventListener("click", editProfile);
        }
    })


    async function editProfile(e) {
        e.preventDefault();
        if (imagePreview.classList.contains("imageUploaded")) {

            const formWrapper = overlay.querySelector("form");
            const formData = new FormData(formWrapper);
            const request = new Request("/server/updateUserProfile.php", {
                header: "Content-Type: application/json",
                method: "POST",
                body: formData,
            });
            const response = await fetch(request);
            const responseMessage = await response.json();
            sendResponseMessage(responseMessage.message, response.status);
        }

        if (displayNameInput.value) {
            const request = new Request("/server/updateUserProfile.php", {
                header: "Content-Type: application/json",
                method: "PATCH",
                body: JSON.stringify({
                    userId: userId,
                    newDisplayName: displayNameInput.value
                }),
            });
            const response = await fetch(request);
            const responseMessage = await response.json();
            sendResponseMessage(responseMessage.message, response.status);
        }
        /*
        if (displayNameInput.value) {
            if (displayNameInput.value === user.userIdentity.displayName) {    sendMessageToUser(document.querySelector("label"), "that's already your name you ear of a bat");   return};
            if (displayNameInput.value.length > 25) {    sendMessageToUser(document.querySelector("label"), "Display name too long king :/");   return};
            const request = new Request("/server/updateUserProfile.php", {
                headers: {"Content-type": "application/json"},
                method: "PATCH",
                body: JSON.stringify({
                    id: userId,
                    newDisplayName: displayNameInput.value
                })
            })

            fetch(request)
                .then(r=>{
                    console.log(r);
                    return r.json()
                })
                .then(r=>{
                    sendMessageToUser(document.querySelector("label"), r.message)
                })




        }
        */
    }
}

function followUnfollow(user, eventTarget) {


    try {

        fetch(new Request("/server/follow.php", {
            headers: { "Content-type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                id: user.userIdentity.id,
                currentUserId: localStorage.userId
            }),
        }));

    } catch (error) { sendMessageToUser("Server Error") }

    if (eventTarget.textContent === "Follow") {
        eventTarget.textContent = "Following";
        const followers = parseInt(document.querySelector("#followers").textContent);
        const newFollowersNumber = followers + 1;
        document.querySelector("#followers").textContent = newFollowersNumber;

    } else {
        eventTarget.textContent = "Follow";
        const followers = parseInt(document.querySelector("#followers").textContent);
        const newFollowersNumber = followers - 1;
        document.querySelector("#followers").textContent = newFollowersNumber;
    }

};

async function showFavourites() {
    const user = await getUserData(localStorage.getItem("userId"));

    document.querySelector("#boardAndReviewContainer").innerHTML = `
    <h1 id="title">SAVED</h1>
    <div id="favourites"></div>`;

    const arrayWithFavourites = user.albumData.favourites;

    if (arrayWithFavourites.length === 0) {
        document.querySelector("#favourites").innerHTML += "<p>No saved albums</p>";
    } else {

        arrayWithFavourites.forEach(favourite => {

            const newFavourite = document.createElement("div");
            newFavourite.classList.add("favourite");
            newFavourite.innerHTML = `
                <img class="favouriteCover"></img>
            <div id="favouriteInfoContainer">
                <p class="favouriteAlbumName">${favourite.albumName}</p>
                <p class="favouriteArtist">${favourite.artist}</p>
            </div>
            <button class="savedButton"></button>`;

            document.querySelector("#favourites").append(newFavourite);
            newFavourite.querySelector(".favouriteCover").style.backgroundImage = `url(${favourite.albumCover})`;
            const saveButton = newFavourite.querySelector(".savedButton");
            saveButton.addEventListener("click", () => {
                addToListenList(favourite, saveButton)
            })
        });
    }

};