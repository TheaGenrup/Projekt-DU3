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
            <p id="who">@ ${review.user_name} added a review</p>
            <p id="when">${review.date} ${review.timestamp}</p>
            <div id="album_overview">
                <div id="album_cover_${review.review_id}" class="album_cover"></div>
                    <div id="album_details">

                        <p id="album_name">${review.album_name}</p>
                        <p id="artist_name">${review.artist_name}</p>
                        <div id="stars_${review.review_id}" class="stars">
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
        document.querySelector(`#album_cover_${review.review_id}`).style.backgroundImage = review.album_cover;

        // change the background image of the right amount of stars
        const stars = document.querySelectorAll(`#stars_${review.review_id} > div`);

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
        review_id: 1,
        album_name: "Dreams",
        artist_name: "Fleetwood Mac",
        user_name: "Elin",
        date: "2023-02-22",
        timestamp: "16:35",
        comment: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad unde ea laborum tempora quidem sint commodi culpa dolorum fugiat illum.",
        rating: 3,
        album_cover: `url(../media/dreams.jpg)`
    },
    {
        review_id: 2,
        album_name: "Och Stora Havet",
        artist_name: "Jakob Hellman",
        user_name: "Thea",
        date: "2023-02-25",
        timestamp: "14:38",
        comment: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad unde ea laborum tempora quidem sint commodi culpa dolorum fugiat illum.",
        rating: 4,
        album_cover: `url(../media/hellman.jpg)`
    }
]);