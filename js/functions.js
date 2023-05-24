"use strict";
// Get User, review or album data
async function getUserData(userId) {
    const response = await fetch(`/server/getUser.php/?id=${userId}`);
    const userData = await response.json();
    return userData;
}

async function getUsersReviews(followingUserId) {

    const allReviews = [];

    const response = await fetch(new Request(`../server/getReviews.php/?id=${followingUserId}`));
    const reviews = await response.json();

    reviews.forEach(review => {
        allReviews.push(review);
    });

    return allReviews;
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours().toString().padStart(2, '0'); // add leading zero if less than 10
    var min = a.getMinutes().toString().padStart(2, '0'); // add leading zero if less than 10
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
    return time;
}

function makeReview(review, container, inProfile) {
    // shorten comment if needed
    let reviewDescription = review.reviewDescription;
    if (reviewDescription.length > 45) {
        reviewDescription = reviewDescription.slice(0, 45) + "...";
    }

    // make html for new review
    const newReview = document.createElement("div");
    newReview.classList.add("review");
    newReview.innerHTML = `
     
        <p id="who" class="bold">@${review.displayName}</p>
        <p id="when">${timeConverter(review.timestamp)}</p>
        <div id="albumOverview">
            <div class="albumCover"></div>
                <div id="albumDetails">

                    <p id="albumName">${review.albumName}</p>
                    <p id="artist">${review.artist}</p>
                    <div id="stars_${review.reviewId}" class="stars">
                        <div class="star"></div>
                        <div class="star"></div>
                        <div class="star"></div>
                        <div class="star"></div>
                        <div class="star"></div>
                    </div>
                    <p id="reviewDescription">${reviewDescription}</p>
            </div>
        </div>`;
    newReview.dataset.albumId = review.albumId
    newReview.dataset.userId = review.userId;
    newReview.dataset.reviewId = review.reviewId;

    // add new review to html
    if (container) { document.querySelector(container).append(newReview); }

    if (inProfile) {
        newReview.id = `review_${review.reviewId}`;
    }

    // add album cover
    if (review.albumCover === "" || review.albumCover === undefined || review.albumCover === null) {

        newReview.querySelector(".albumCover").style.backgroundImage = "url(../media/icons/defaultCover.png)";
    } else {

        newReview.querySelector(".albumCover").style.backgroundImage = `url(${review.albumCover}`;
    }

    fillStars(review.rating, newReview);

}

function fillStars(rating, reviewContainer) {

    const stars = reviewContainer.querySelectorAll(`.stars > div`);

    for (let i = 0; i < stars.length; i++) {

        const star = stars[i];
        if (i < rating) {
            star.style.backgroundImage = `url(../media/icons/filled_in_star.png)`;
        }
    }
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

function addToListenList(album, saveButton) {
    const userId = localStorage.getItem("userId")
    const bodyData = {
        album: album,
        userId: userId
    }

    const request = new Request("/server/addToListenList.php", {
        header: "Content-Type: application/json",
        method: "POST",
        body: JSON.stringify(bodyData)
    });

    try {
        fetch(request)
            .then(r => r.json())
            .then(responseData => {
                if (responseData.message = "success") {
                    saveButton.classList.toggle("saveButton");
                    saveButton.classList.toggle("savedButton");
                }
            })

    } catch (error) { }

}

function startLoadingScreen(elementToAddTo) {
    const VinylHtml = `
    <div class="vinylShadow"></div>
    <div class="circleContainer">
        <div class="vinylReflection"></div>
        <div class="innerCircle1"></div>
        <div class="innerCircle2"></div>
        <div class="albumCircle"></div>
        <div class="etchCircle1 etchCircle"></div>
        <div class="etchCircle2 etchCircle"></div>
        <div class="etchCircle3 etchCircle"></div>
        <div class="etchCircle4 etchCircle"></div>
        <div class="etchCircle5 etchCircle"></div>
        <div class="outerCircle etchCircle"></div>
    </div>
    `
    const loaderContainer = document.createElement("div");
    loaderContainer.classList.add("vinylloaderC");
    loaderContainer.innerHTML = VinylHtml;
    elementToAddTo.append(loaderContainer);
    //loaderContainer.querySelector("#circleContainer").style.opacity = 0;

}

function stopLoadingScreen() {
    const loaderDom = document.querySelector(".vinylloaderC");
    loaderDom.remove();
}

function renderPopUp(event) {
    event.stopPropagation();

    const popUp = document.createElement("div");

    popUp.id = "popUp";

    popUp.innerHTML = ` 
        <p>Are you sure you want to delete this review?</p>
        <div>
            <div id="cancelBtn">Cancel</div>
            <div id="continueBtn">Continue</div>
        </div>`;

    document.querySelector("#contentContainer").prepend(popUp);

    document.querySelector("#cancelBtn").addEventListener("click", hidePopUp);
    document.querySelector("#continueBtn").addEventListener("click", event => {
        event.target.parentElement.remove();
        deleteReview(event.target.dataset.reviewId);
    });
    document.querySelector("#continueBtn").dataset.reviewId = event.currentTarget.dataset.reviewId;

}

function hidePopUp() {
    document.querySelector("#popUp").classList.add("closed");
}

async function fetchReview(userId) {
    const response = await fetch(new Request(`../server/getReviews.php/?id=${userId}`));
    const reviews = await response.json();
    return reviews;
}

function sendResponseMessage(message, statusCode) {
    const messageContainer = document.createElement("div");
    const html = `
    <div>
        <button></button>
        <p> ${message}</p>
    </div>
    `
    messageContainer.id = "messageContainer";
    messageContainer.innerHTML = html;
    const closeButton = messageContainer.querySelector("button");
    console.log(closeButton);
    console.log(message);
    console.log(statusCode);
    if (statusCode < 200 || statusCode > 299) {
        closeButton.addEventListener("click", () => { messageContainer.remove(); })
    } else {
        if (message === "Review added!" || message === "Board added!") {
            closeButton.addEventListener("click", () => { messageContainer.remove(); renderCreateReviewView(); })
        }
        if (message == "Profile updated") {
            closeButton.addEventListener("click", () => {
                messageContainer.remove();
                document.querySelector(".overlayReview").remove();
                location.reload();
            })
        }

    }

    document.body.append(messageContainer);


}