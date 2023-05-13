"use strict";

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

    if (followingIds.length === 0) {
        console.log("no following users");
    } else {

        const allFollowingUsersReviews = [];

        // get reviews of all following users by their ids, one user at a time
        for (const followingUserId of followingIds) {

            const reviewsOneUser = await getReviews(followingUserId);

            reviewsOneUser.forEach(review => {
                allFollowingUsersReviews.push(review);
            });

        }


        allFollowingUsersReviews.sort((a, b) => b.timestamp - a.timestamp);


        // go through all reviews to create them
        allFollowingUsersReviews.forEach(review => {


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
                <div id="album_overview">
                    <div id="album_cover_${review.reviewId}" class="album_cover"></div>
                        <div id="album_details">
    
                            <p id="album_name">${review.albumName}</p>
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

            const reviewElement = document.querySelector(`#review_${review.reviewId}`);

            reviewElement.dataset.userId = review.userId;
            reviewElement.dataset.reviewId = review.reviewId;

            // add album cover
            if (review.albumCover === "" || review.albumCover === undefined || review.albumCover === null) {

                document.querySelector(`#album_cover_${review.reviewId}`).style.backgroundImage = "url(../media/icons/default_cover.png)";
            } else {

                document.querySelector(`#album_cover_${review.reviewId}`).style.backgroundImage = `url(../media/albumCovers/${review.albumCover})`;
            }

            fillStars(review.rating, review.reviewId);

        });

        document.querySelectorAll(`.review`).forEach(review => { review.addEventListener("click", expandReview); });
    }

}


function renderProfileView() {

    const userId = localStorage.getItem("userId");

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
            const displayName = user.userIdentity.displayName;

            document.querySelector("#content_container").innerHTML = `
                <div id="profile_header">
                    <div>
                        <img id="profile_picture_top" src="../media/${profilePicture}"></img>
                        <p>@${displayName}</p>
                    </div> 
                    <div>
                        <div id="following_followers">
                            <div>Followers</div>
                            <div>${userFollowers}</div>
                            <div>Following</div>
                            <div>${userFollowing}</div>
                        </div>
                        <div id="profile_icons">
                            <div class="settingsDropdown">
                                <div id="settings_icon" class="pointer"></div>
                                <div id="dropdown_content">
                                    <div id="editAccountBtn" class="pointer">Edit Account</div>
                                    <div id="logOutBtn" class="pointer">Log Out</div>
                                </div>
                            </div>
                            
                            <div id="bookmark_icon" class="pointer"></div>
                            <div id="add_board_icon" class="pointer"></div>
                        </div>
                    </div>
                </div>
                <div id="board_and_review_container">
                    <h2>BOARDS</h2>
                    <div id="board_of_boards"></div>
                </div>`

            document.querySelector("#settings_icon").addEventListener("click", e => {
                document.querySelector("#dropdown_content").style.display = "block";
            });
            document.querySelector("#settings_icon").addEventListener("click", showSettingsDropdown);
            document.querySelector("#bookmark_icon").addEventListener("click", showFavourites);

            function showFavourites(event) {

                document.querySelector("#board_and_review_container").innerHTML = `
                <div id="favourites_icon_container">
                    <img id="favourites_icon" src="../media/icons/bookmark.png"></img>
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
                            <img class="favourite_cover" src="../media/albumCovers/${favouritePicture}"></img>
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

                document.querySelector("#board_and_review_container").innerHTML = `<div id="add_review" class="pointer">ADD REVIEW</div>`;
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

                reviewsInBoard.sort((a, b) => b.timestamp - a.timestamp);


                reviewsInBoard.forEach(review => {

                    // shorten comment if needed
                    let reviewDescription = review.reviewDescription;
                    if (reviewDescription.length > 50) {
                        reviewDescription = reviewDescription.slice(0, 50) + "...";
                    }


                    // make html for new review
                    const newReview = `

                        <div class="review" id="review_${review.reviewId}>
                            <p id="who">@ ${user.userIdentity.displayName}</p>
                            <p id="when">${timeConverter(review.timestamp)}</p>
                            <div id="album_overview">
                                <div id="album_cover_${review.reviewId}" class="album_cover"></div>
                                <div id="album_details">

                                    <p id="albumName"><span class="bold">${review.albumName}</span></p>
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

                    /*                     const reviewElement = document.querySelector(`#review_${review.reviewId}`);
                                        console.log(reviewElement);
                                        reviewElement.dataset.userId = review.userId;
                                        reviewElement.dataset.reviewId = review.reviewId;
                     */
                    //OBS! dessa är inte sorterade och stjärnorna syns inte

                    // add album cover
                    if (review.albumCover === "" || review.albumCover === undefined || review.albumCover === null) {

                        document.querySelector(`#album_cover_${review.reviewId}`).style.backgroundImage = "url(../media/icons/default_cover.png)";
                    } else {

                        document.querySelector(`#album_cover_${review.reviewId}`).style.backgroundImage = `url(../media/albumCovers/${review.albumCover})`;
                    }

                    // change the background image of the right amount of stars
                    fillStars(review.rating, review.reviewId);
                });


                /*  document.querySelectorAll(".review").forEach(review => {
                     review.addEventListener("click", expandReview);
                 }) */
            }
        });
};


async function expandReview(event) {

    document.querySelector("#css1").setAttribute("href", "../css/logged_in_basic_layout.css");
    document.querySelector("#css2").setAttribute("href", "../css/expandedReview.css");
    document.querySelector("#content_container").innerHTML = "";

    const userId = event.currentTarget.dataset.userId;
    const reviewId = event.currentTarget.dataset.reviewId;

    const reviews = await fetchReview(userId);


    reviews.forEach(review => {

        if (reviewId == review.reviewId) {

            document.querySelector("#content_container").innerHTML = `
                
                <p id="timestamp"><span>${timeConverter(review.timestamp)}</span></p>
                <p id="display_name"><span class="bold pointer">@${review.displayName}</span> reviewed</p>
                <p id="album_name">${review.albumName}</p>
                <p id="artist">${review.artist}</p>
                <div class="album_cover_container">
                    <img src="url(../media/albumCovers/${review.albumCover})" alt="Album Cover">
                    <img src="/media/icons/bookmark.png" id="bookmark" alt="Bookmark">
                </div>
                <div class="stars">
                    <div class="star"></div>
                    <div class="star"></div>
                    <div class="star"></div>
                    <div class="star"></div>
                    <div class="star"></div>
                </div>
                <p id="review_description">${review.reviewDescription}</p>
                <p id="other_reviews_head">Previous reviews</p>
                <div id="other_reviews_container"></div>
           
            `;

            fillStars(review.rating);

            document.querySelector(`#display_name`).addEventListener("click", renderProfileView);
        }
    })
}

function showSettingsDropdown(event) {

    document.querySelector("#settings_icon").addEventListener("click", e => {
        document.querySelector("#dropdown_content").style.display = "none";
    });

}