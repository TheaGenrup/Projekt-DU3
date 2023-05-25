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
     
        <p id="who" class="bold">${review.displayName}</p>
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

function lineBreakString(string) {
    let adjustedString = string;
    while (string.includes("\n")) {
        adjustedString = adjustedString.replace("\n", "<br>");
        string = adjustedString;
    }
    return string;
}