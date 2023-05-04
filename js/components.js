"use strict";

// om du ska testa den här funktionen, glöm inte ladda rätt css_filer
function renderLoggedInView(userIdentity) {

    document.querySelector("body").innerHTML = `

    <main>
        <div id="content_container"></div>
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

// renderLoggedInView({ profilePic: "../media/profile_picture.jpg" });

// om du ska testa den här funktionen, glöm inte ladda rätt css_filer
function renderDiscoverView(reviews) {

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
/* 
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
        userName: "Filip",
        date: "2023-02-26",
        timestamp: "12:39",
        comment: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad unde ea laborum tempora quidem sint commodi culpa dolorum fugiat illum.",
        rating: 2,
        albumCover: `url(../media/hellman.jpg)`
    }
]); */

function renderProfileView(userId) {

    const request = new Request(`/server/getUser.php/?id=${userId}`);
    fetch(request)
        .then(r => r.json())
        .then(resource => {
            const user = resource;
            console.log(user);
        });

    const profilePicture = user.userIdentity.profilePic;
    const userFollowers = user.userSocial.followers.length;
    const userFollowing = user.userSocial.following.length;
    const username = user.userCredentials.username;

    document.querySelector("#content_container").innerHTML = `
    <div id="profile_header">
        <div>
            <div id="profile_picture"></div>
            <p>@${username}</p>
        </div> 
        <div>
            <div id="following_followers">
                <div>Followers</div>
                <div>${userFollowers}</div>
                <div>Following</div>
                <div>${userFollowing}</div>
            </div>
            <div>
                <div id="settings_icon"></div>
                <div id="bookmark_icon"></div>
                <div id="add_board_icon"></div>
            </div>
        </div>
    </div>
    <div>
        <div id="profile_main">
            <h2>BOARDS</h2>
            <div id="board_of_boards"></div>
        </div>
    </div>
    `

    document.querySelector("#profile_picture").style.backgroundImage = profilePicture;

    const boards = userInfo[0].albumData.boards;

    boards.forEach(board => {

        const boardName = board.boardName;
        const boardPicture = board.thumbnail;

        const newBoard = `
        <div class="profile_board">
            <div>
                <img src="${boardPicture}">
            </div>
            <p class="board_name">${boardName}</p>
        </div>
        `
        document.querySelector("#board_of_boards").innerHTML += newBoard;

        console.log(document.querySelector(".board_name"));

    });

    document.querySelectorAll(".board_name").forEach(board => {
        board.addEventListener("click", showBoard);
    });

};

function showBoard(event) {

    //how to pass arguments in to an addeventlistener
    //Boards har ID

    console.log(event.target.textContent);

    // Theas function för reviews som jag tror vi kan använda här med
    // go through all reviews to create them
    /* reviews.forEach(review => {

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

    }); */


}

renderProfileView("607133432034891031030642696328");
