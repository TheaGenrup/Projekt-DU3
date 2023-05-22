"use strict";

async function editAccount(e) {
    const userId = localStorage.getItem("userId");
    const editAccountContainer = document.querySelector("#contentContainer");
    const user = await getUserData(userId);
    editAccountContainer.innerHTML = "";
    let html = `
    <div>Edit profile</div>
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
    editAccountContainer.innerHTML = html
    const imageUploader = document.querySelector("#imageUploader");
    const imagePreview = document.querySelector("#imagePreview");
    const backButton = document.querySelector("#goBackButton");
    const createButton = document.querySelector("#createButton");
    const displayNameInput = document.querySelector("#searchField");
    const usersCurrentProfielPicture = user.userIdentity.profilePic;
    createButton.addEventListener("click", (e) => { e.preventDefault() });
    backButton.addEventListener("click", (e) => { e.preventDefault() });

    if (user.userIdentity.profilePic = "") {
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
    displayNameInput.addEventListener("keyup", (e)=>{
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

        const formWrapper = editAccountContainer.querySelector("form");
        const formData = new FormData(formWrapper);
        console.log(formData);
        const request = new Request("/server/updateUserProfile.php",{
        header: "Content-Type: application/json",
        method: "POST",
        body: formData,
        });

        try {
            fetch(request)
                .then(response => {
                    console.log(response);
                    return response.json();
                })
                .then(r => {
                    console.log(r);
                })

        } catch (error) {
            console.log(error);
        }
        
    }
}