"use strict";

async function getReviews(followingUserId) {

    const allReviews = [];

    const response = await fetch(new Request(`../server/getReviews.php/?id=${followingUserId}`));
    const reviews = await response.json();

    reviews.forEach(review => {
        allReviews.push(review);
    });

    return allReviews;
}

async function getAllUsers() {

    const response = await fetch(new Request(`../server/getAllUsers.php`));
    return await response.json();

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

function makeReview(review, container) {

    // shorten comment if needed
    let reviewDescription = review.reviewDescription;
    if (reviewDescription.length > 50) {
        reviewDescription = reviewDescription.slice(0, 50) + "...";
    }

    // make html for new review
    const newReview = `
     
            <div class="review" id="review_${review.reviewId}">
                <p id="who" class="bold">@${review.displayName} added a review</p>
                <p id="when">${timeConverter(review.timestamp)}</p>
                <div id="albumOverview">
                    <div id="albumCover_${review.reviewId}" class="albumCover"></div>
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
                </div>
            </div>`;

    // add new review to html
    document.querySelector(container).innerHTML += newReview;

    const reviewElement = document.querySelector(`#review_${review.reviewId}`);

    reviewElement.dataset.userId = review.userId;
    reviewElement.dataset.reviewId = review.reviewId;

    // add album cover
    if (review.albumCover === "" || review.albumCover === undefined || review.albumCover === null) {

        document.querySelector(`#albumCover_${review.reviewId}`).style.backgroundImage = "url(../media/icons/defaultCover.png)";
    } else {

        document.querySelector(`#albumCover_${review.reviewId}`).style.backgroundImage = `url(../media/albumCovers/${review.albumCover})`;
    }

    fillStars(review.rating, review.reviewId);

}

function fillStars(rating, reviewId) {

    let stars;

    if (reviewId == undefined) {
        // if the function is called in expandReview
        stars = document.querySelectorAll(`.stars > div`);
    } else {
        // if the function is called in renderDiscoverView
        stars = document.querySelectorAll(`#stars_${reviewId} > div`);
    }

    for (let i = 0; i < stars.length; i++) {

        const star = stars[i];
        if (i < rating) {
            star.style.backgroundImage = `url(../media/icons/filled_in_star.png)`;
        }
    }
}


function displayAlbum(albumData) {
    const resultsWindow = document.querySelector("#resultsWindow");
    const artistName = albumData.artistName
    const albumName = albumData.albumName
    const albumCover = albumData.albumCover
    const albumId = albumData.albumId
    let html = `
        <button id="closeResultsButton"></button>
        <div id="albumInfo">
            <div id="averageRatingContainer">
                <p id="averageRating">5/5</p>
                <p>Rating</p>
            </div>
            <img id="searchNavigator" src="${albumCover}" alt="">
        </div>
        <div id="artistInfo">
            <p id="artistName">${artistName}</p>
            <p id="albumName">${albumName}</p>
        </div>
        <div id="addReviewButtonContainer">
            <button id="reviewButton">Review Album?</button>
        </div>
        <ul id="reviewsContainer"></ul>
    `
    resultsWindow.innerHTML = html
    if (albumData.reviewDirectly) { renderCreateReviewView(albumData) }
    try {
        fetch(`/server/getReviews.php?albumId=${albumId}`)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(averageRatingData => console.log())
    } catch (error) {
        
    }
    resultsWindow.dataset.albumId = albumId;
    resultsWindow.style.display = "flex";
    const closeButton       = resultsWindow.querySelector("#closeResultsButton");
    const ReviewAlbumButton = resultsWindow.querySelector("#reviewButton");
    // Event listers
    closeButton.addEventListener("click", ()=>{ resultsWindow.style.display = "none" });

    ReviewAlbumButton.addEventListener("click", sendAlbumData);
    function sendAlbumData() {
        albumData.reviewDirectly = true;
        renderCreateReviewView(albumData);
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
            <div class="verticalContainer">
                <p id="chosenArtist">${artistName}</p>
                <p id="chosenAlbum">${albumName}</p>
            </div>
            <img src="${albumCover}" id="albumImagePreview">
        </div>

        <div id="chooseBoardContainer">
            <label for="chooseBoard">Choose board</label>
            <select id="selectBoard"></select>
        </div>

        <div id="rateAlbumContainer" class="open">
            <label for="">Album rating</label>
            <div id="chooseRatingContainer">
                <div class="chosen" data-rating="1"></div>
                <div data-rating="2"></div>
                <div data-rating="3"></div>
                <div data-rating="4"></div>
                <div data-rating="5"></div>
            </div>
        </div>

        <div class="open">
            <label for="">ReviewDescription</label>
            <textarea name="" id="reviewDescription" cols="30" rows="10"></textarea>
        </div>
    </form>

    <div class="horizontalContainer">
        <button id="goBackButton" class="navigationButton">Go back</button>
        <button for="uploadWrapper" id="createButton" class="navigationButton">Create</button>
    </div>  
    `;
    createContainer.innerHTML = html;
    createContainer.classList.add("board");
    // consts
    const albumSearchField = document.querySelector("#searchField");
    const albumUl = createContainer.querySelector("#albumUl");
    const selectBoard = document.querySelector("#selectBoard");
    const backButton = createContainer.querySelector("#goBackButton");
    const createButton = createContainer.querySelector("#createButton");
    const starRatings = createContainer.querySelectorAll("#chooseRatingContainer div");
    // Event listener
    // Prevent default for submitting forms
    createButton.addEventListener("click", (e)=>{ e.preventDefault()});
    backButton.addEventListener("click", (e)=>{ e.preventDefault()});
    //Add boards to list of options
    usersBoards.forEach(board => {
        const optionDom = document.createElement("option");
        optionDom.value = board.boardName;
        optionDom.textContent = board.boardName;
        optionDom.id = board.boardId
        selectBoard.dataset.boardId = usersBoards[0].boardId
        optionDom.addEventListener("click", ()=>{
            selectBoard.dataset.boardId = optionDom.id
        })
        selectBoard.append(optionDom);
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

    function addReview(e) {
        e.preventDefault();
        const formData = {
            
        }
        addBoardOrReview(formData);
    }

    backButton.addEventListener("click", renderCreateReviewView);
    createButton.addEventListener("click", addReview);
}