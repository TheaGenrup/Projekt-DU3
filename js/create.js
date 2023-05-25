"use strict";

// Add a new review or board function
async function addBoardOrReview(bodyData) {
    const uploadWrapper = document.querySelector("#uploadWrapper");
    startLoadingScreen(document.querySelector("main"));
    if (uploadWrapper.dataset.type === "review") {

        const request = new Request("/server/addBoardOrReview.php", {
            header: "Content-Type: application/json",
            method: "POST",
            body: JSON.stringify(bodyData),
        });
        const response = await fetch(request);
        const resource = await response.json();
        stopLoadingScreen();
        sendResponseMessage(resource.message, response.status);
    }


    if (uploadWrapper.dataset.type === "board") {
        const request = new Request("/server/addBoardOrReview.php", {
            header: "Content-Type: application/json",
            method: "POST",
            body: bodyData,
        });
        const response = await fetch(request);
        const resource = await response.json();
        stopLoadingScreen();
        sendResponseMessage(resource.message, response.status);
    }
}


function renderCreateBoard() {
    createContainer = contentContainer.querySelector("#createContainer");
    let html =
        `
    <form id="uploadWrapper" data-type="board">
        <div id="imageUploaderContainer">
            <img id="imagePreview" src=""></img>
            <input type="file" id="imageUploader" accept="image/*" name="imageInput">
        </div>
        <input type="text" id="searchField" name="nameInput" placeholder="Choose name for your board" autocomplete="off">
        <input name="userId" style="display:none" value="${localStorage.getItem("userId")}">
    </form>
    <div id="buttonContainer">
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
    // Show image preview
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
    backButton.addEventListener("click", renderCreateReviewView);
}

async function renderCreateReview(albumData) {
    // Get user boards
    const userId = localStorage.getItem("userId");
    const response = await fetch(`/server/getUser.php?id=${userId}`);
    const userData = await response.json();
    const usersBoards = userData.albumData.boards;

    const artistName = albumData.artistName
    const albumName = albumData.albumName
    const albumCover = albumData.albumCover
    const albumId = albumData.albumId

    const createContainer = document.querySelector("#createContainer");
    let html =
        `
    <form id="uploadWrapper" data-type="review">
        <div id="selectedAlbumContainer" class="horizontalContainer">
            <div id="artist">
            <p id="chosenAlbum">${albumName}</p>
            <p id="chosenArtist">${artistName}</p>
            </div>
            <img src="${albumCover}" id="albumImagePreview">
        </div>

        <div id="chooseBoardContainer">
            <label for="chooseBoard">Choose board</label>
            <div id="customSelect">
                <div id="selectedValue"></div>
                <div id="selectArrow"></div>
                <div id="dropdownSelector" class="hidden">
                </div>
            </div>
        </div>

        <div id="rateAlbumContainer" class="open">
            <div id="chooseRatingContainer">
                <div class="chosen" data-rating="1"></div>
                <div data-rating="2"></div>
                <div data-rating="3"></div>
                <div data-rating="4"></div>
                <div data-rating="5"></div>
            </div>
        </div>

        <div class="open">
            <textarea name="" id="reviewDescription" placeholder="Describe your feelings when listening to this album" cols="30" rows="10"></textarea>
        </div>
    </form>

    <div class="buttonContainer">
        <button id="goBackButton" class="navigationButton">Go back</button>
        <button for="uploadWrapper" id="createButton" class="navigationButton">Create</button>
    </div>  
    `;
    createContainer.innerHTML = html;
    createContainer.classList.add("board");
    // consts
    const backButton = createContainer.querySelector("#goBackButton");
    const createButton = createContainer.querySelector("#createButton");
    const starRatings = createContainer.querySelectorAll("#chooseRatingContainer div");
    const customSelect = createContainer.querySelector("#customSelect");
    const selectArrow = createContainer.querySelector("#selectArrow");
    const dropdownSelector = createContainer.querySelector("#dropdownSelector");
    const selectedValue = createContainer.querySelector("#selectedValue");
    // Event listener
    // Prevent default for submitting forms
    createButton.addEventListener("click", (e) => { e.preventDefault() });
    backButton.addEventListener("click", (e) => { e.preventDefault() });
    backButton.addEventListener("click", renderCreateReviewView)
    createButton.addEventListener("click", addReview)
    //Add boards to list of options
    usersBoards.forEach(board => {
        const optionDom = document.createElement("div");
        optionDom.value = board.boardName;
        optionDom.textContent = board.boardName;
        optionDom.id = board.boardId;
        optionDom.classList.add("option");
        optionDom.addEventListener("click", (e) => {
            e.stopPropagation();
            customSelect.dataset.boardId = optionDom.id;
            dropdownSelector.dataset.boardId = optionDom.id;
            selectedValue.textContent = optionDom.value;
            dropdownSelector.classList.add("hidden");
        })

        document.addEventListener("click", (e) => {
            if (e.target != selectedValue) {
                e.stopPropagation();
                dropdownSelector.classList.add("hidden");
            }
        })
        dropdownSelector.append(optionDom);

    });
    selectedValue.textContent = usersBoards[0].boardName;
    customSelect.dataset.boardId = usersBoards[0].boardId;
    customSelect.value = usersBoards[0].boardName;
    customSelect.addEventListener("click", () => {
        dropdownSelector.classList.toggle("hidden");
        selectArrow.classList.toggle("spin");
    });
    //Star rating function
    starRatings.forEach(star => {
        //star.addEventListener("click", chooseRating)
        star.addEventListener("mouseover", (e) => {
            const index = parseInt(e.target.dataset.rating);
            const starRatings = e.target.parentElement.querySelectorAll("div");
            starRatings.forEach(star => {
                star.style.backgroundImage = "url(/media/icons/star-regular.svg)";
            });
            for (let i = 0; i < index; i++) {
                starRatings[i].style.backgroundImage = "url(/media/icons/star-solid.svg)";

            }
        });
        star.addEventListener("mouseleave", (e) => {
            const starRatings = e.target.parentElement.querySelectorAll("div");
            starRatings.forEach(star => {
                if (!star.classList.contains("chosen")) {
                    star.style.backgroundImage = "url(/media/icons/star-regular.svg)";
                    starRatings[0].style.backgroundImage = "url(/media/icons/star-solid.svg)";
                }
            });
        });
        star.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.rating);
            const starRatings = e.target.parentElement.querySelectorAll("div");
            starRatings.forEach(star => {
                star.classList.remove("chosen");
            });
            for (let i = 0; i < index; i++) {
                starRatings[i].style.backgroundImage = "url(/media/icons/star-solid.svg)";
                starRatings[i].classList.add("chosen");
            }
        });
    });

    function addReview() {
        const rating = document.querySelectorAll(".chosen").length
        const reviewDescription = document.querySelector("#reviewDescription").value
        const boardId = parseInt(document.querySelector("#customSelect").dataset.boardId);
        const reviewObject = {
            rating: rating,
            reviewDescription: reviewDescription,
            boardId: boardId,
            artistName: artistName,
            albumName: albumName,
            albumCover: albumCover,
            albumId: albumId,
            userId: userId,
            review: "review"
        }
        addBoardOrReview(reviewObject);

    }
    backButton.addEventListener("click", renderCreateReviewView);
    createButton.addEventListener("click", addReview);
}