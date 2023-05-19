"use strict";

async function editAccount(e) {
    const userId = localStorage.getItem("userId");
    const editAccountContainer = document.querySelector("#contentContainer");
    const user = await getUserData(userId);
    console.log(user);
    editAccountContainer.innerHTML = "";
    let html = `
        <form id="uploadWrapper">
        <div>Change profile picture</div>
            <div id="imageUploaderContainer">
                <img id="imagePreview" src=""></img>
                <input type="file" id="imageUploader" accept="image/jpeg" name="imageInput">
                <input name="userId" style="display:none" value="${userId}">
            </div>
        </form>

        <div class="horizontalContainer">
        <button id="goBackButton" class="navigationButton">Cancel</button>
        <button for="uploadWrapper" id="createButton" class="navigationButton disabled">Save</button>
    `
    editAccountContainer.innerHTML = html
    const imageUploader = document.querySelector("#imageUploader");
    const imagePreview = document.querySelector("#imagePreview");
    const backButton = document.querySelector("#goBackButton");
    const createButton = document.querySelector("#createButton");
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
            createButton.addEventListener("click", UploadPhoto)
        }

        function UploadPhoto(e) {
            e.preventDefault();
            const formWrapper = editAccountContainer.querySelector("form");
            const formData = new FormData(formWrapper);
            const request = new Request("/server/updateUserProfile.php",{
            header: "Content-Type: application/json",
            method: "PATCH",
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

    };
}

/*

        imageUploader.onchange = evt => {
            const [file] = imageUploader.files;
            if (file) {
                imagePreview.classList.add("imageUploaded");
                imagePreview.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
            }
        };
        // allow create if inputfield is not empy
        boardNameInput.addEventListener("keyup", (e) => {
            const input = e.target.value;
            if (!input) {
                createButton.classList.add("disabled");
                createButton.removeEventListener("click", addBoard);
                return
            }
            createButton.classList.remove("disabled");
            createButton.addEventListener("click", addBoard)

        })
        function addBoard(e) {
            e.preventDefault();
            const formWrapper = createContainer.querySelector("form");
            const formData = new FormData(formWrapper);
            addBoardOrReview(formData);
        }


                    <form id="uploadWrapper" data-type="board">
            <input type="text" id="searchField" name="nameInput" placeholder="Name your board queen yas..." autocomplete="off">
            <input name="userId" style="display:none" value="${userId}">

            <div id="imageUploaderContainer">
                <img id="imagePreview" src=""></img>
                <input type="file" id="imageUploader" accept="image/*" name="imageInput">
            </div>
            </form>
            <div class="horizontalContainer">
            <button id="goBackButton" class="navigationButton">Go back</button>
            <button for="uploadWrapper" id="createButton" class="navigationButton disabled">Create</button>
        </div>
        `;
        createContainer.innerHTML = html;
        createContainer.classList.add("board");
        // consts
        const imageUploader = createContainer.querySelector("#imageUploader");
        const imagePreview = createContainer.querySelector("#imagePreview");
        const boardNameInput = createContainer.querySelector("#searchField");
        const backButton = createContainer.querySelector("#goBackButton");
        const createButton = createContainer.querySelector("#createButton");
        createButton.addEventListener("click", (e) => { e.preventDefault() });
        backButton.addEventListener("click", (e) => { e.preventDefault() });


*/