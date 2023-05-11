"use strict";

// om du ska testa den här funktionen, glöm inte ladda rätt css_filer
function renderLoggedInView(profilePic) {

    document.querySelector("body").innerHTML = `

    <main>
        <div id="content_container"></div>
    </main>
    <nav>
        <img class="view_icon" id="discover_icon" src="/media/icons/discover.png" alt="Discover"></img>
        <img class="view_icon" id="search_icon" src="/media/icons/search.png" alt="Search"></img>
        <img class="view_icon" id="add_icon" src="/media/icons/add.png" alt="Add"></img>
        <img class="view_icon" id="profile_picture" src="../media/${profilePic}" alt="Profile"></img>
    </nav>
    `;

    document.querySelector("#discover_icon").addEventListener("click", renderDiscoverView);
    document.querySelector("#profile_picture").addEventListener("click", renderProfileView);

}
/* 
renderLoggedInView("profile_picture.jpg");

renderDiscoverView("607133432034891031030642696328"); */
// om du ska testa den här funktionen, glöm inte ladda rätt css_filer
async function renderDiscoverView() {

    document.querySelector("#content_container").innerHTML = "";

    const userId = localStorage.getItem("userId");

    // switch css files
    document.querySelector("#css1").setAttribute("href", "../css/logged_in_basic_layout.css");
    document.querySelector("#css2").setAttribute("href", "../css/discover.css");

    // fetch logged in user to get following ids
    const responseUser = await fetch(new Request(`../server/getUser.php/?id=${userId}`));

    const userData = await responseUser.json();

    const followingIds = userData.userSocial.following;
    const allFollowingUsersReviews = [];

    // get reviews of all following users by their ids, one user at a time
    for (const followingUserId of followingIds) {

        const reviewsOneUser = await getReviews(followingUserId);

        reviewsOneUser.forEach(review => {
            allFollowingUsersReviews.push(review);
        });

        async function getReviews(followingUserId) {

            const allReviews = [];

            const response = await fetch(new Request(`../server/getReviews.php/?id=${followingUserId}`));
            const reviews = await response.json();

            reviews.forEach(review => {
                allReviews.push(review);
            });

            return allReviews;
        }
    }



    allFollowingUsersReviews.sort((a, b) => b.timestamp - a.timestamp);


    // go through all reviews to create them
    allFollowingUsersReviews.forEach(review => {


        // shorten comment if needed
        let reviewDescription = review.reviewDescription;
        if (reviewDescription.length > 55) {
            reviewDescription = reviewDescription.slice(0, 55) + "...";
        }

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

        // make html for new review
        const newReview = `
     
            <div class="review">
                <p id="who">@${review.displayName} added a review</p>
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

    document.querySelector("#css1").setAttribute("href", "../css/logged_in_basic_layout.css");
    document.querySelector("#css2").setAttribute("href", "../css/profile.css");

    const request = new Request(`/server/getUser.php/?id=${userId}`);
    fetch(request)
        .then(r => r.json())
        .then(resource => {
            const user = resource;


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
                        if (i < review.rating) {
                            star.style.backgroundImage = `url(../media/icons/filled_in_star.png)`;
                        }
                    }
                })



            }
        });
};


