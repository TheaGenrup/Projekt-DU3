"use strict";

// om du ska testa den här funktionen, glöm inte ladda rätt css_filer
function renderLoggedInView(userIdentity) {

    document.querySelector("body").innerHTML = `

    <main>
    </main>
    <nav>
        <img class="view_icon" src="/media/icons/discover.png" alt="Discover"></img>
        <img class="view_icon" src="/media/icons/search.png" alt="Search"></img>
        <img class="view_icon" src="/media/icons/add.png" alt="Add"></img>
        <img class="view_icon" id="profile_picture" src="/media/icons/${userIdentity.profilePic}.png" alt="Profile"></img>
    </nav>
    `;

    document.querySelector("#profile_picture").src = userIdentity.profilePic;

}

// om du ska testa den här funktionen, glöm inte ladda rätt css_filer
function renderDiscoverView(reviews) {

    document.querySelector("main").innerHTML = `<div id="content_container"></div>`;

    // go through all reviews to create them
    reviews.forEach(review => {

        // shorten comment if needed
        let comment = review.reviewDescription;
        if (comment.length > 55) {
            comment = comment.slice(0, 55) + "...";
        }

        // shorten album name if needed
        let albumName = review.albumName;
        if (albumName.length > 23) {
            albumName = albumName.slice(0, 23) + "...";
        }

        // shorten artist name if needed
        let artist = review.artist;
        if (artist.length > 23) {
            artist = artist.slice(0, 23) + "...";
        }

        // make html for new review
        const newReview = `
 
        <div class="review">
            <p id="who">@ ${review.displayName} added a review</p>
            <p id="when">${review.date} ${review.timestamp}</p>
            <div id="album_overview">
                <div id="album_cover_${review.reviewId}" class="album_cover"></div>
                    <div id="album_details">

                        <p id="albumName">${albumName}</p>
                        <p id="artist">${artist}</p>
                        <div id="stars_${review.reviewId}" class="stars">
                            <div class="star"></div>
                            <div class="star"></div>
                            <div class="star"></div>
                            <div class="star"></div>
                            <div class="star"></div>
                        </div>
                        <p id="review">${comment}</p>
                </div>
            </div>
        </div>`;

        // add new review to html
        document.querySelector("#content_container").innerHTML += newReview;

        // add album cover
        // add album cover
        if (review.albumCover === "" || review.albumCover === undefined) {

            document.querySelector(`#album_cover_${review.reviewId}`).style.backgroundImage = "url(../media/icons/default_cover.png)";
        } else {

            document.querySelector(`#album_cover_${review.reviewId}`).style.backgroundImage = review.albumCover;
        }

        // change the background image of the right amount of stars
        const stars = document.querySelectorAll(`#stars_${review.reviewId} > div`);

        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            if (i < review.rating) {
                star.style.backgroundImage = `url(../media/icons/filled_in_star.png)`;
            }
        }

    });


}