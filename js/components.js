"use strict";
function renderLoginPage() {
    localStorage.clear();
    const html = `
    <main id="mainContainer">
        <div id="limitWrapper">
            <div id="loginAndRegisterPageContainer">
                <div id="logoBanner">
                    <h1>Laulu :D</h1>
                </div>
                <div id="loginMessageContainer">
                    <div id="loginRegisterSign">Login</div>
                    <div id="loginRegistermessage"></div>
                </div>
                <div id="loginAndRegisterFormContainer">
                    <form id="loginAndRegisterForm" class="loginForm">
                        <input type="text" id="usernameInput" placeholder="username">
                        <input type="password" id="passwordInput" placeholder="password">
                        <input type="text" id="displaynameInput" placeholder="displayname">
                    </form>
                </div>
                <div id="loginRegisterSwitch">
                    <button id="loginRegisterBtn" class="loginBtn">Log in</button>
                    <p><span class="signupText">Don't have an account?</span> <span id="switchBtn">Sign up</span></p>
                </div>
            </div>
        </div>
    </main>
    `
    document.body.innerHTML = html;
    const switchBtn = document.querySelector("#switchBtn");
    const loginRegisterbtn = document.querySelector("#loginRegisterBtn");
    switchBtn.addEventListener("click", switchLoginRegsiter);
    loginRegisterbtn.addEventListener("click", loginRegister)
    document.querySelector("#css1").setAttribute("href", "/css/registerLogin.css");
    document.querySelector("#css2").setAttribute("href", "/css/loggedInBasicLayout.css");
    return
}
// Render Logged in view
function renderLoggedInView(profilePic) {

    document.querySelector("body").innerHTML = `
    <main>
        <div id="contentContainer"></div>
    </main>
    <nav>
        <img class="viewIcon" id="discoverIcon" src="/media/icons/discover.png" alt="Discover"></img>
        <img class="viewIcon" id="searchIcon" src="/media/icons/search.png" alt="Search"></img>
        <img class="viewIcon" id="addIcon" src="/media/icons/add.png" alt="Add"></img>
        <img class="viewIcon" id="profilePicture" src="/media/${profilePic}" alt="Profile"></img>
    </nav>
    `;

    document.querySelector(`#profilePicture`).dataset.userId = localStorage.getItem("userId");
    // DOM Event listeners
    document.querySelector("#discoverIcon").addEventListener("click", renderDiscoverView);
    document.querySelector("#profilePicture").addEventListener("click", renderProfileView);
    document.querySelector("#searchIcon").addEventListener("click", renderSearchView);
    document.querySelector("#addIcon").addEventListener("click", renderCreateReviewView);
    return;
}

async function renderDiscoverView() {

    document.querySelector("#contentContainer").innerHTML = "";

    const userId = localStorage.getItem("userId");

    // switch css files
    document.querySelector("#css1").setAttribute("href", "../css/loggedInBasicLayout.css");
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

        document.querySelectorAll(`.review`).forEach(review => review.addEventListener("click", expandReview));
    }

};

async function renderSearchView(e) {
    // Get Spotify token
    token = await fetchToken();
    if (document.querySelector("#searchWindow")) { return };
    const contentContainer = document.querySelector("#contentContainer");
    const html = `
    <div id="searchWindow">
        <div>
            <input type="text" id="searchField" placeholder="Album, Artist, user">
        </div>
        <ul id=userUl> </ul>
        <ul id=albumUl> </ul>
    </div>
    `;
    contentContainer.innerHTML = html;
    document.querySelector("#searchField").addEventListener("keyup", searchAlbums);
    document.querySelector("#searchField").addEventListener("keyup", searchUsers);

    // CSS change
    document.querySelector("#css2").setAttribute("href", "/css/search.css");
};

async function renderCreateReviewView(params) {
    const userId = localStorage.getItem("userId");
    const response = await fetch(`/server/getUser.php?id=${userId}`);
    const userData = await response.json();

    const usersBoards = userData.albumData.boards;

    console.log(usersBoards);
    const contentContainer = document.querySelector("#contentContainer");
    contentContainer.innerHTML = "";
    const html =
        `
        <h3>Review Album</h3>
        <div id="createContainer">
            <div class="createOption">New Board</div>
            <div class="createOption">New Review</div>
        </div>
    `;
    // <input type="text" placeholder="Album, Artist" id="searchField">   
    contentContainer.innerHTML = html;

    // CSS Change
    document.querySelector("#css2").setAttribute("href", "/css/create.css");
};

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
                <h2 id="title">BOARDS</h2>
                <div id="boardAndReviewContainer">
                    <div id="boardContainer"></div>
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
                <div id="addBoardIcon" class="pointer"></div>
                `;

                document.querySelector("#settingsIcon").addEventListener("click", e => document.querySelector("#dropdownContent").classList.toggle("closed"));
                document.querySelector("#logOutBtn").addEventListener("click", e => {
                    renderLoginPage();
                })
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
                <div id="board_${board.boardId}" class="board">
                    <img class="boardCover" src="../media/${boardPicture}"></img>
                    <p class="boardName">${boardName}</p>
                </div>
                `
                document.querySelector("#boardContainer").innerHTML += newBoard;


            });

            document.querySelectorAll(".boardName").forEach(board => {
                board.addEventListener("click", openBoard);
            });



            function openBoard(event) {

                document.querySelector("#title").textContent = event.target.textContent;

                document.querySelector("#boardAndReviewContainer").innerHTML = ``;

                if (clickedUserId === loggedInUserId) {
                    document.querySelector("#boardAndReviewContainer").innerHTML = `
                    <div id="addReview" class="pointer">ADD REVIEW</div>`;
                }

                const reviewsInBoard = [];

                user.albumData.boards.forEach(board => {

                    if (board.boardName === event.target.textContent) {

                        const boardId = board.boardId;
                        const arrayWithReviews = user.albumData.reviews

                        arrayWithReviews.forEach(review => {

                            review.boards.forEach(board => {

                                if (board === boardId) {
                                    review.userId = user.userIdentity.id;
                                    review.displayName = user.userIdentity.displayName;
                                    reviewsInBoard.push(review);
                                }
                            })
                        })


                    }
                });

                reviewsInBoard.sort((a, b) => b.timestamp - a.timestamp);


                reviewsInBoard.forEach(review => {

                    makeReview(review, "#boardAndReviewContainer");
                });



                if (clickedUserId === loggedInUserId) {
                    document.querySelectorAll(".review").forEach(review => {

                        const reviewId = review.dataset.reviewId;
                        console.log(reviewId);

                        const newElement = document.createElement("div");
                        newElement.classList.add("deleteBtn");
                        document.querySelector(`#review_${reviewId}`).prepend(newElement);

                        newElement.dataset.reviewId = reviewId;

                    });

                    document.querySelector(".deleteBtn").addEventListener("click", deleteReview);
                }

                document.querySelectorAll(".review").forEach(review => {
                    review.addEventListener("click", expandReview);
                })
            }
        });
};

async function expandReview(event) {

    document.querySelector("#css1").setAttribute("href", "../css/loggedInBasicLayout.css");
    document.querySelector("#css2").setAttribute("href", "../css/expandedReview.css");
    document.querySelector("#contentContainer").innerHTML = "";

    const clickedUserId = event.currentTarget.dataset.userId;
    const clickedReviewId = event.currentTarget.dataset.reviewId;

    const reviewsOfClickedUser = await fetchReview(clickedUserId);

    reviewsOfClickedUser.forEach(async (firstLoopThroughReview) => {

        if (clickedReviewId == firstLoopThroughReview.reviewId) {

            document.querySelector("#contentContainer").innerHTML = `
                
                <div id="closeReview" class="pointer"></div>
                <p id="timestampExpanded"><span>${timeConverter(firstLoopThroughReview.timestamp)}</span></p>
                <p id="displayNameExpanded"><span class="bold pointer">@${firstLoopThroughReview.displayName}</span> reviewed</p>
                <p id="albumNameExpanded">${firstLoopThroughReview.albumName}</p>
                <p id="artistExpanded">${firstLoopThroughReview.artist}</p>
                <div class="albumCoverContainer">
                    <img src="/media/icons/bookmark.png" id="bookmark" alt="Bookmark">
                    <img src="../media/albumCovers/${firstLoopThroughReview.albumCover}" alt="Album Cover" id="albumCoverExpanded">
                </div>
                <div class="stars">
                    <div class="star" class="starExpanded"></div>
                    <div class="star" class="starExpanded"></div>
                    <div class="star" class="starExpanded"></div>
                    <div class="star" class="starExpanded"></div>
                    <div class="star" class="starExpanded"></div>
                </div>
                <p id="reviewDescription">${firstLoopThroughReview.reviewDescription}</p>
                <p id="otherReviewsHead">Other reviews of this album</p>
                <div id="previousReviewsContainer"></div>
           
            `;

            fillStars(firstLoopThroughReview.rating);

            document.querySelector("#displayNameExpanded").dataset.userId = firstLoopThroughReview.userId;

            document.querySelector(`#displayNameExpanded`).addEventListener("click", renderProfileView);
            document.querySelector(`#closeReview`).addEventListener("click", e => renderDiscoverView());

            // previous reviews
            const users = await getAllUsers();

            const allReviewsOfAlbum = [];
            users.forEach(user => {
                user.albumData.reviews.forEach(secondLoopThroughReview => {

                    if (secondLoopThroughReview.albumId === firstLoopThroughReview.albumId) {

                        secondLoopThroughReview.displayName = user.userIdentity.displayName;
                        secondLoopThroughReview.userId = user.userIdentity.id;
                        secondLoopThroughReview.profilePicture = user.userIdentity.profilePic;

                        // se till så att den reviewn vi redan kollar på inte kommer upp under sig själv
                        if (secondLoopThroughReview.reviewId === firstLoopThroughReview.reviewId) {
                            return;
                        }

                        allReviewsOfAlbum.push(secondLoopThroughReview);
                    }
                });
            })

            //kolla om det inte finns några
            if (allReviewsOfAlbum.length === 0) {
                document.querySelector("#previousReviewsContainer").innerHTML = "<p>No other reviews yet...</p>";
            }

            allReviewsOfAlbum.forEach(review => {

                // shorten comment if needed
                let reviewDescription = review.reviewDescription;
                if (reviewDescription.length > 70) {
                    reviewDescription = reviewDescription.slice(0, 70) + "...";
                }

                // make html for new review
                const newReview = `
     
                <div class="review" id="review_${review.reviewId}">
                    <div id="userInfo">
                        <div id="profilePictureInReview"></div>
                        <div>
                            <p id="who" class="bold">@${review.displayName}</p>
                            <p id="when">${timeConverter(review.timestamp)}</p>
                        </div>
                    </div>
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
                </div>`;

                // add new review to html
                document.querySelector("#previousReviewsContainer").innerHTML += newReview;

                const reviewElement = document.querySelector(`#review_${review.reviewId}`);

                reviewElement.dataset.userId = review.userId;
                reviewElement.dataset.reviewId = review.reviewId;

                fillStars(review.rating, review.reviewId);

                //profilbilderna funkar inte

                reviewElement.addEventListener("click", e => expandReview(e));

            })

        }
    })
};


