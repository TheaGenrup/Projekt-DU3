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

function makeDiscoverBoards(params) {

}

function makeReview(review, container, displayNameLine) {

    // shorten comment if needed
    let reviewDescription = review.reviewDescription;
    if (reviewDescription.length > 45) {
        reviewDescription = reviewDescription.slice(0, 45) + "...";
    }

    // make html for new review
    const newReview = document.createElement("div");
    newReview.classList.add("review");
    newReview.innerHTML = `
     
        <p id="who" class="bold">@${review.displayName} added a review</p>
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
    // add new review to html
    document.querySelector(container).append(newReview);
    if (displayNameLine === "test") { newReview.querySelector(".bold").textContent = review.displayName  }

    newReview.dataset.userId = review.userId;
    newReview.dataset.reviewId = review.reviewId;

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


async function displayAlbum(albumData) {
    const resultsWindow = document.querySelector("#resultsWindow");
    const artistName = albumData.artistName
    const albumName = albumData.albumName
    const albumCover = albumData.albumCover
    const albumId = albumData.albumId
    let html = `
        <button id="closeResultsButton"></button>
        <div id="albumInfo">
            <div id="averageRatingContainer">
                <p id="averageRating"></p>
                <p>Rating</p>
                <p id="totalReviews"></p>
            </div>
            <img id="" src="${albumCover}" alt="">
        </div>
        <div id="artistInfo">
            <p id="albumName">${albumName}</p>
            <p id="artistName">${artistName}</p>
        </div>
        <div id="addReviewButtonContainer">
            <button id="reviewButton">Review Album?</button>
        </div>
        <ul id="reviewsContainer"></ul>
    `
    resultsWindow.innerHTML = html
    if (albumData.reviewDirectly) { renderCreateReviewView(albumData) }
    const averageRatingContainer = resultsWindow.querySelector("#averageRatingContainer");
    const averageRatingPDom = resultsWindow.querySelector("#averageRating");
    const totalReviewsPDom = resultsWindow.querySelector("#totalReviews");
    const reviewsUl = resultsWindow.querySelector("#reviewsContainer");
    const searchwWindow = document.querySelector("#searchWindow");
    try {
        fetch(`/server/getReviews.php/?albumId=${albumId}`)
            .then(response => {
                if (response.status === 204) {
                    averageRatingContainer.innerHTML = `<p>Unrated, be the first!</p>`;
                    reviewsUl.innerHTML = "<p>No reviews yet<p>"
                }
                return response.json();
            })
            .then(resource => {
                const averageRating = resource.averageRating;
                const totalReviews = resource.totalReviews;
                const reviews = resource.reviews;
                reviews.sort((a, b) => b.timestamp - a.timestamp);
                averageRatingPDom.textContent = `${averageRating}/5`;
                totalReviewsPDom.textContent = `Total reviews: ${averageRating}`;
                if (reviews.length > 0) {
                    reviews.forEach(review => {
                        listReview(review)
                    });
                }

                function listReview(review) {
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

                    newReview.dataset.userId = review.userId;
                    newReview.dataset.reviewId = review.reviewId;

                    fillStars(review.rating, newReview);

                    reviewsUl.append(newReview)
                }

                
            })
    } catch (error) { console.log(error); };

    resultsWindow.dataset.albumId = albumId;
    resultsWindow.style.display = "flex";
    const closeButton = resultsWindow.querySelector("#closeResultsButton");
    const ReviewAlbumButton = resultsWindow.querySelector("#reviewButton");
    // Event listers
    // Closing the result window
    closeButton.addEventListener("click", () => { resultsWindow.style.display = "none"; searchwWindow.classList.remove("hidden") });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { resultsWindow.style.display = "none"; } })

    document.querySelector("#searchWindow").classList.add("hidden");
    const userData = await getUserData(localStorage.getItem("userId"));
    if (userData.albumData.boards.length > 0) {
        ReviewAlbumButton.addEventListener("click", ()=> {
            albumData.reviewDirectly = true;
            renderCreateReviewView(albumData);
        });
    } else {
        ReviewAlbumButton.textContent = "Wish to review this album? Start by creating a board!"
        ReviewAlbumButton.addEventListener("click", renderCreateReviewView)
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
            <div id="customSelect">
                <div id="selectedValue">test</div>
                <div id="selectArrow"></div>
                <div id="dropdownSelector" class="hidden">
                </div>
            </div>
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
        optionDom.addEventListener("click", (e) =>{
            e.stopPropagation();
            customSelect.dataset.boardId = optionDom.id;
            dropdownSelector.dataset.boardId = optionDom.id;
            selectedValue.textContent = optionDom.value;
            dropdownSelector.classList.add("hidden");
        })

        document.addEventListener("click", (e)=>{
            if (e.target != selectedValue) {
                e.stopPropagation();
                dropdownSelector.classList.add("hidden");
            }
        })
        dropdownSelector.append(optionDom);
        
    });

    customSelect.dataset.boardId = usersBoards[0].boardId
    customSelect.value = usersBoards[0].boardName
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

    const request = new Request("/server/addToListenList.php",{
        header: "Content-Type: application/json",
        method: "POST",
        body: JSON.stringify(bodyData)
    });

    try {
        fetch(request)
            .then(r=>r.json())
            .then(responseData=> {
                if (responseData.message = "success") {
                saveButton.classList.toggle("saveButton");
                saveButton.classList.toggle("savedButton");
            }
            })
        
    } catch (error) { }
    
}

async function getUserData(userId) {
    const response = await fetch(`/server/getUser.php/?id=${userId}`);
    const userData = await response.json();
    return userData;
}
function startLoadingScreen(elementToAddTo) {
    const VinylHtml =`
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

function name(params) {
    
}