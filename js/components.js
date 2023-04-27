function renderLoggedInView(activeTab) {

    document.querySelector("body").innerHTML = `

    <header>
        <div id="laulu">LAULU</div>
    </header>
    <main>
    </main>
    <nav>
        <div id="discover_icon">Home</div>
        <div id="search_icon"></div>
        <div id="add_icon">Add</div>
        <div id="profile_icon">Profile</div>
    </nav>
    `

    // den här funktionen funkar inte längre efterson det är ikoner, inte text
    document.querySelectorAll(".viewIcon").forEach(viewIcon => {

        if (viewIcon.textContent.toLowerCase().replace(" ", "") == activeviewIcon.toLowerCase()) {
            viewIcon.classList.add("active")
        } else {
            viewIcon.classList.add("inactive")
        }
    });

}

renderLoggedInView("myProfile");

function renderDiscoverView(reviews) {

    reviews.forEach(review => {

        document.querySelector("main").innerHTML =
            `<div id="content_container"></div>`;

        const newReview = `
 
        <div class="review">
            <p id="who"></p>
            <p id="when"></p>
            <div id="album_overview">
                <div id="album_cover"></div>
                    <div id="album_details">

                        <p id="album_name"></p>
                        <p id="artist_name"></p>
                        <div id="stars">
                            <div class="star"></div>
                            <div class="star"></div>
                            <div class="star"></div>
                            <div class="star"></div>
                            <div class="star"></div>
                        </div>
                        <p id="review">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad unde ea laborum tempora quidem sint commodi culpa dolorum fugiat illum.</p>
                </div>
            </div>
        </div>`

        document.querySelector("#content_container").innerHTML += newReview;

        document.querySelector("#who").textContent = "@" + review.user_name + " added a review";
        document.querySelector("#when").textContent = review.date + " " + review.timestamp;

        document.querySelector("#album_cover").style.backgroundImage = `url(../media/dreams.jpg)`;

        document.querySelector("#album_name").textContent = review.album_name;
        document.querySelector("#artist_name").textContent = review.artist_name;
    });


}

renderDiscoverView([
    {
        album_name: "Dreams",
        artist_name: "Fleetwood Mac",
        user_name: "Thea",
        date: "2023-02-22",
        timestamp: "16:35",
    }
]);