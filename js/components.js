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

    document.querySelector("#profile_picture").addEventListener("click", renderProfileView);

}

//renderLoggedInView({ profilePic: "../media/profile_picture.jpg" });

renderDiscoverView("607133432034891031030642696328");
// om du ska testa den här funktionen, glöm inte ladda rätt css_filer
async function renderDiscoverView(userId) {

    // fetch logged in user to get following
    const responseUser = await fetch(new Request(`../server/getUser.php/?id=${userId}`));
    const userData = await responseUser.json();

    const followingIds = userData.userSocial.following;

    const allFollowingUsersReviews = [];

    /* followingIds.forEach(async followingUserId => {

        const response = await fetch(new Request(`../server/getUser.php/?id=${followingUserId}`));
        const userData = await response.json();

        console.log(userData.albumData);
        userData.albumData.reviews.slice(-20).forEach(review => {
            console.log(allFollowingUsersReviews);
            allFollowingUsersReviews.push(review);
        });


    }) */


    for (let i = 0; i < followingIds.length; i++) {
        const followingUserId = followingIds[i];
        getReviews(followingUserId);
    }

    /*     async function getReviews(followingUserId) {
            const response = await fetch(new Request(`../server/getUser.php/?id=${followingUserId}`));
            const userData = await response.json();
    
            userData.albumData.reviews.slice(-20).forEach(review => {
                allFollowingUsersReviews.push(review);
            })
        } */

    async function getReviews(followingUserId) {
        const response = await fetch(new Request(`../server/getReviews.php/?id=${followingUserId}`));
        const reviews = await response.json();

        const slicedReviews = reviews.slice(-30);

        slicedReviews.forEach(review => {
            review.timestamp = new Date(review.timestamp)
            allFollowingUsersReviews.push(review);
        });

    }

    /*     const latestReviews = [];
    
        allFollowingUsersReviews.forEach(review => {
            console.log(review);
    
            const twentyLatestReviews = review.albumData.reviews.slice(-3);
            console.log(twentyLatestReviews);
            twentyLatestReviews.forEach(review => latestReviews.push(review));
        })
        console.log(latestReviews); */
    console.log(allFollowingUsersReviews);

    // sort latest reviews
    /*     const latestReviewsSorted = allFollowingUsersReviews.map(review => new Date(review.timestamp)).sort((a, b) => b - a); */

    /*     allFollowingUsersReviews.sort(function (a, b) {
            return Date.parse(b.timestamp) - Date.parse(a.timestamp);
        }); */
    /* const myArray = [
        {
            "albumName": "Infest the Rat's nest",
            "artist": "King Gizzard and the lizzard wizard",
            "albumId": "5Bz2LxOp0wz7ov0T9WiRmc",
            "reviewId": 0,
            "reviewDescription": "I like when the music is making noise",
            "rating": 5,
            "boards": [
                0
            ],
            "timestamp": "2025-01-21T23:12:35",
            "displayName": "Anthony Fantano"
        },
        {
            "albumName": "Dreams",
            "artist": "Fleetwood Mac",
            "albumId": "78",
            "reviewId": 1,
            "reviewDescription": "Woah! I've never cried like this before, except maybe when I saw the whale in theaters and I sat there bawling for like 2/3 hours? Yeah great feeling.",
            "rating": 5,
            "boards": [
                0
            ],
            "timestamp": "2027-02-13T03:12:43",
            "displayName": "Anthony Fantano"
        },
        {
            "albumName": "Abbey Road",
            "artist": "The Beatles",
            "albumId": "43",
            "reviewId": 1,
            "reviewDescription": "Woah! I've never cried like this before, except maybe when I saw the whale in theaters and I sat there bawling for like 2/3 hours? Yeah great feeling.",
            "rating": 5,
            "boards": [
                0
            ],
            "timestamp": "2023-03-16T21:17:11",
            "displayName": "Anthony Fantano"
        }
    ];

    myArray.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA;
    });

    console.log(myArray); */


    allFollowingUsersReviews.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());


    console.log(allFollowingUsersReviews);


    // go through all reviews to create them
    allFollowingUsersReviews.forEach(review => {

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


function renderProfileView() {

    //ändra sedan denna till localstorage ID:et
    const userId = "607133432034891031030642696328";

    const request = new Request(`/server/getUser.php/?id=${userId}`);
    fetch(request)
        .then(r => r.json())
        .then(resource => {
            const user = resource;
            console.log(user);

            const profilePicture = user.userIdentity.profilePic;
            const userFollowers = user.userSocial.followers.length;
            const userFollowing = user.userSocial.following.length;
            const username = user.userCredentials.username;

            document.querySelector("#content_container").innerHTML = `
                <div id="profile_header">
                    <div>
                        <img id="profile_picture_top" src="../media/${profilePicture}"></img>
                        <p>@${username}</p>
                    </div> 
                    <div>
                        <div id="following_followers">
                            <div>Followers</div>
                            <div>${userFollowers}</div>
                            <div>Following</div>
                            <div>${userFollowing}</div>
                        </div>
                        <div id="profile_icons">
                            <div id="settings_icon"></div>
                            <div id="bookmark_icon"></div>
                            <div id="add_board_icon"></div>
                        </div>
                    </div>
                </div>
                <div id="board_and_review_container">
                    <h2>BOARDS</h2>
                    <div id="board_of_boards"></div>
                </div>`

            document.querySelector("#bookmark_icon").addEventListener("click", showFavourites);

            function showFavourites(event) {

                document.querySelector("#board_and_review_container").innerHTML = `
                <div id="favourites_icon_container">
                    <img id="favourites_icon" src="../media/icons/Discover.png"></img>
                </div>
                <div id="favourites"></div>
                `;

                const arrayWithFavourites = user.albumData.favourites;

                arrayWithFavourites.forEach(favourite => {

                    const favouriteAlbum = favourite.albumName;
                    const favouriteArtist = favourite.artist;
                    const favouritePicture = favourite.thumbnail;

                    const newFavourite = `
                    <div class="favourite">
                            <img class="favourite_cover" src="../media/${favouritePicture}"></img>
                        <div id="favourite_info_container">
                            <p class="favourite_album_name">${favouriteAlbum}</p>
                            <p class="favourite_artist">${favouriteArtist}</p>
                        </div>
                    </div>
                    `
                    document.querySelector("#favourites").innerHTML += newFavourite;


                })


            }

            const boards = user.albumData.boards;

            boards.forEach(board => {

                const boardName = board.boardName;
                const boardPicture = board.thumbnail;

                const newBoard = `
                <div class="profile_board">
                    <div>
                        <img src="../media/${boardPicture}"></img>
                    </div>
                    <p class="board_name">${boardName}</p>
                </div>
                `
                document.querySelector("#board_of_boards").innerHTML += newBoard;

            });

            document.querySelectorAll(".board_name").forEach(board => {
                board.addEventListener("click", showBoard);
            });

            function showBoard(event) {

                document.querySelector("#board_and_review_container").innerHTML = `
                <div id="add_review">ADD REVIEW</div>
                `;
                const reviewsInBoard = [];

                user.albumData.boards.forEach(board => {

                    if (board.boardName === event.target.textContent) {

                        const boardID = board.boardId;
                        const arrayWithReviews = user.albumData.reviews

                        arrayWithReviews.forEach(review => {

                            review.boards.forEach(board => {

                                if (board === boardID) {
                                    reviewsInBoard.push(review);
                                }
                            })
                        })


                    }
                });
                console.log(reviewsInBoard);

                reviewsInBoard.forEach(review => {

                    function timeConverter(UNIX_timestamp) {
                        var a = new Date(UNIX_timestamp * 1000);
                        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        var year = a.getFullYear();
                        var month = months[a.getMonth()];
                        var date = a.getDate();
                        var hour = a.getHours();
                        var min = a.getMinutes();
                        var sec = a.getSeconds();
                        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
                        return time;
                    }

                    console.log(review);
                    // shorten comment if needed
                    let reviewDescription = review.reviewDescription;
                    if (reviewDescription.length > 55) {
                        reviewDescription = reviewDescription.slice(0, 55) + "...";
                    }


                    // make html for new review
                    const newReview = `

                        <div class="review">
                            <p id="who">@ ${user.userIdentity.displayName} added a review</p>
                            <p id="when">${timeConverter(review.timestamp)}</p>
                            <div id="album_overview">
                                <div id="album_cover_${review.reviewId}" class="album_cover"></div>
                                <div id="album_details">

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
                        </div> `;

                    // add new review to html


                    document.querySelector("#board_and_review_container").innerHTML += newReview;


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
                        console.log(star);
                        if (i < review.rating) {
                            star.style.backgroundImage = `url(../media/icons/filled_in_star.png)`;
                        }
                    }
                })



            }
        });
};


