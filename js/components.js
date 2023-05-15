"use strict";

function renderLoggedInView(profilePic) {

    document.querySelector("body").innerHTML = `

    <main>
        <div id="contentContainer"></div>
    </main>
    <nav>
        <img class="viewIcon" id="discoverIcon" src="/media/icons/discover.png" alt="Discover"></img>
        <img class="viewIcon" id="openSearchWindowBtn" src="/media/icons/search.png" alt="Search"></img>
        <img class="viewIcon" id="addIcon" src="/media/icons/add.png" alt="Add"></img>
        <img class="viewIcon" id="profilePicture" src="../media/${profilePic}" alt="Profile"></img>
    </nav>
    `;

    document.querySelector(`#profilePicture`).dataset.userId = localStorage.getItem("userId");

    document.querySelector("#discoverIcon").addEventListener("click", renderDiscoverView);
    document.querySelector("#profilePicture").addEventListener("click", renderProfileView);




}

async function renderDiscoverView() {

    document.querySelector("#contentContainer").innerHTML = "";

    const userId = localStorage.getItem("userId");

    // switch css files
    document.querySelector("#css1").setAttribute("href", "../css/logged_in_basic_layout.css");
    document.querySelector("#css2").setAttribute("href", "../css/discover.css");

    // fetch logged in user to get following ids
    const responseUser = await fetch(new Request(`../server/getUser.php/?id=${userId}`));

    const userData = await responseUser.json();

    const followingIds = userData.userSocial.following;

    // check if the user follows anyone
    if (followingIds.length === 0) {
        console.log("no following users");

        document.querySelector("#contentContainer").innerHTML = `<p id="noFollowing">It seems like you're not following anyone...</p>`;
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

            makeReview(review, "#contentContainer");

        });

        document.querySelectorAll(`.review`).forEach(review => { review.addEventListener("click", expandReview); });
    }

}


function renderProfileView(event) {

    const clickedUserId = event.currentTarget.dataset.userId;
    const loggedInUserId = localStorage.getItem("userId");

    document.querySelector("#css1").setAttribute("href", "../css/loggedInBasicLayout.css");
    document.querySelector("#css2").setAttribute("href", "../css/profile.css");

    const request = new Request(`/server/getUser.php/?id=${clickedUserId}`);
    fetch(request)
        .then(r => r.json())
        .then(resource => {
            const user = resource;

            const profilePicture = user.userIdentity.profilePic;
            const userFollowers = user.userSocial.followers.length;
            const userFollowing = user.userSocial.following.length;
            const displayName = user.userIdentity.displayName;

            document.querySelector("#contentContainer").innerHTML = `
                <div id="profileHeader">
                    <div>
                        <img id="profilePictureTop" src="../media/${profilePicture}"></img>
                        <p>@${displayName}</p>
                    </div> 
                    <div>
                        <div id="followingFollowers">
                            <div>Followers</div>
                            <div>${userFollowers}</div>
                            <div>Following</div>
                            <div>${userFollowing}</div>
                        </div>
                        <div id="profileIconsOrFollowButton"></div>
                    </div>
                </div>
                <div id="boardAndReviewContainer">
                    <h2 class="boardTitle">BOARDS</h2>
                    <div id="boardOfBoards"></div>
                </div>`




            if (clickedUserId !== loggedInUserId) {
                document.querySelector("#profileIconsOrFollowButton").innerHTML = `
                <button id="followButton">Follow</button>
                `;
            } else {
                document.querySelector("#profileIconsOrFollowButton").innerHTML = `
                <div class="settingsDropdown">
                    <div id="settingsIcon" class="pointer"></div>
                    <div id="dropdownContent" class="closed">
                        <div id="editAccountBtn" class="pointer">Edit Account</div>
                        <div id="logOutBtn" class="pointer">Log Out</div>
                    </div>
                </div>                            
                <div id="bookmarkIcon" class="pointer"></div>
                <div id="add_boardIcon" class="pointer"></div>
                `;

                document.querySelector("#settingsIcon").addEventListener("click", e => document.querySelector("#dropdownContent").classList.toggle("closed"));
                document.querySelector("#bookmarkIcon").addEventListener("click", showFavourites);
            }

            function showFavourites(event) {

                document.querySelector("#boardAndReviewContainer").innerHTML = `
                <div id="favouritesIconContainer">
                    <img id="favouritesIcon" src="../media/icons/bookmark.png"></img>
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
                            <img class="favouriteCover" src="../media/albumCovers/${favouritePicture}"></img>
                        <div id="favouriteInfoContainer">
                            <p class="favouriteAlbumName">${favouriteAlbum}</p>
                            <p class="favouriteArtist">${favouriteArtist}</p>
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
                <div class="profileBoard">
                    <div>
                        <img src="../media/${boardPicture}"></img>
                    </div>
                    <p class="boardName">${boardName}</p>
                </div>
                `
                document.querySelector("#boardOfBoards").innerHTML += newBoard;

            });

            document.querySelectorAll(".boardName").forEach(board => {
                board.addEventListener("click", showBoard);
            });



            function showBoard(event) {

                document.querySelector("#boardAndReviewContainer").innerHTML = `
                <h1 class="boardTitle">${event.target.textContent}</h1>
                <div id="addReview" class="pointer">ADD REVIEW</div>`;

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
                            <div id="albumOverview">
                                <div id="albumCover_${review.reviewId}" class="albumCover"></div>
                                <div id="albumDetails">

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
                    document.querySelector("#boardAndReviewContainer").innerHTML += newReview;

                    /*                     const reviewElement = document.querySelector(`#review_${review.reviewId}`);
                                        console.log(reviewElement);
                                        reviewElement.dataset.userId = review.userId;
                                        reviewElement.dataset.reviewId = review.reviewId;
                     */
                    //OBS! dessa är inte sorterade och stjärnorna syns inte

                    // add album cover
                    if (review.albumCover === "" || review.albumCover === undefined || review.albumCover === null) {

                        document.querySelector(`#albumCover_${review.reviewId}`).style.backgroundImage = "url(../media/icons/default_cover.png)";
                    } else {

                        document.querySelector(`#albumCover_${review.reviewId}`).style.backgroundImage = `url(../media/albumCovers/${review.albumCover})`;
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

    document.querySelector("#css1").setAttribute("href", "../css/loggedInBasicLayout.css");
    document.querySelector("#css2").setAttribute("href", "../css/expandedReview.css");
    document.querySelector("#contentContainer").innerHTML = "";

    const userId = event.currentTarget.dataset.userId;
    const reviewId = event.currentTarget.dataset.reviewId;

    const reviews = await fetchReview(userId);


    reviews.forEach(review => {

        if (reviewId == review.reviewId) {

            document.querySelector("#contentContainer").innerHTML = `
                
                <div id="closeReview"></div>
                <p id="timestamp"><span>${timeConverter(review.timestamp)}</span></p>
                <p id="displayName"><span class="bold pointer">@${review.displayName}</span> reviewed</p>
                <p id="albumName">${review.albumName}</p>
                <p id="artist">${review.artist}</p>
                <div class="albumCoverContainer">
                    <img src="/media/icons/bookmark.png" id="bookmark" alt="Bookmark">
                    <img src="../media/albumCovers/${review.albumCover}" alt="Album Cover" 
                    
                    id="albumCoverExpanded">
                </div>
                <div class="stars">
                    <div class="star"></div>
                    <div class="star"></div>
                    <div class="star"></div>
                    <div class="star"></div>
                    <div class="star"></div>
                </div>
                <p id="reviewDescription">${review.reviewDescription}</p>
                <p id="otherReviewsHead">Previous reviews</p>
                <div id="otherReviewsContainer"></div>
           
            `;

            fillStars(review.rating);

            document.querySelector("#displayName").dataset.userId = review.userId;

            document.querySelector(`#displayName`).addEventListener("click", renderProfileView);
        }
    })
}
