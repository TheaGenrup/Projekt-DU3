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