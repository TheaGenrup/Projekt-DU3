function renderLoggedInView(activeTab) {

    document.querySelector("body").innerHTML = `

    <main>
    </main>
    <nav>
        <div id="discover_icon">Home</div>
        <div id="search_icon"></div>
        <div id="add_icon">Add</div>
        <div id="profile_icon">Profile</div>
    </nav>
    `;

    // den här funktionen funkar inte längre efterson det är ikoner, inte text
    document.querySelectorAll(".viewIcon").forEach(viewIcon => {

        if (viewIcon.textContent.toLowerCase().replace(" ", "") == activeviewIcon.toLowerCase()) {
            viewIcon.classList.add("active");
        } else {
            viewIcon.classList.add("inactive");
        }
    });

}

renderLoggedInView("myProfile");


function renderDiscoverView(reviews) {

    document.querySelector("main").innerHTML = `<div id="content_container"></div>`;

    // go through all reviews to create them
    reviews.forEach(review => {

        // shorten comment
        let comment = review.comment;
        if (comment.length > 50) {
            comment = comment.slice(0, 50) + "...";
        }

        // make html for new review
        const newReview = `
 
        <div class="review">
            <p id="who">@ ${review.userName} added a review</p>
            <p id="when">${review.date} ${review.timestamp}</p>
            <div id="album_overview">
                <div id="album_cover_${review.reviewId}" class="album_cover"></div>
                    <div id="album_details">

                        <p id="albumName">${review.albumName}</p>
                        <p id="artistName">${review.artistName}</p>
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
        document.querySelector(`#album_cover_${review.reviewId}`).style.backgroundImage = review.albumCover;

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

renderDiscoverView([
    {
        reviewId: 1,
        albumName: "Dreams",
        artistName: "Fleetwood Mac",
        userName: "Elin",
        date: "2023-02-22",
        timestamp: "16:35",
        comment: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad unde ea laborum tempora quidem sint commodi culpa dolorum fugiat illum.",
        rating: 3,
        albumCover: `url(../media/dreams.jpg)`
    },
    {
        reviewId: 2,
        albumName: "Och Stora Havet",
        artistName: "Jakob Hellman",
        userName: "Thea",
        date: "2023-02-25",
        timestamp: "14:38",
        comment: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad unde ea laborum tempora quidem sint commodi culpa dolorum fugiat illum.",
        rating: 4,
        albumCover: `url(../media/hellman.jpg)`
    },
    {
        reviewId: 3,
        albumName: "Och Stora Havet",
        artistName: "Jakob Hellman",
        userName: "Thea",
        date: "2023-02-25",
        timestamp: "14:38",
        comment: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad unde ea laborum tempora quidem sint commodi culpa dolorum fugiat illum.",
        rating: 4,
        albumCover: `url(../media/hellman.jpg)`
    }
]);