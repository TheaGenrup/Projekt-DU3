"use strict";

function renderLoginPage() {
    localStorage.clear();
    const html = `
    <main id="mainContainer">
        <div id="limitWrapper">
            <div id="loginAndRegisterPageContainer">
                <div id="logoBanner">
                    <h1>Laulu</h1>
                </div>
                <div id="loginMessageContainer">
                    <div id="loginRegisterSign">Login</div>
                    <div id="loginRegistermessage"></div>
                </div>
                <div id="loginAndRegisterFormContainer">
                    <form id="loginAndRegisterForm" class="loginForm">
                        <input type="text" id="usernameInput" placeholder="username" maxlength="25">
                        <input type="password" id="passwordInput" placeholder="password" maxlength="30">
                        <input type="text" id="displaynameInput" placeholder="displayname" maxlength="25">
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
        <button class="viewIcon iconHover" id="discoverIcon"></button>
        <button class="viewIcon iconHover" id="searchIcon"></button>
        <button class="viewIcon iconHover" id="addIcon"></button>
        <button class="viewIcon" id="profilePicture"></button>
    </nav>
    `;

    document.querySelector(`#profilePicture`).dataset.userId = localStorage.getItem("userId");

    if (profilePic === "" || profilePic === undefined || profilePic === null) {

        document.querySelector(`#profilePicture`).style.backgroundImage = `url(/media/default.png)`;
    } else {

        document.querySelector(`#profilePicture`).style.backgroundImage = `url(/media/usersMedia/${localStorage.userId}/${profilePic})`;
    }


    // DOM Event listeners
    document.querySelector("#discoverIcon").addEventListener("click", renderDiscoverView);
    document.querySelector("#profilePicture").addEventListener("click", () => {
        renderProfileView(localStorage.getItem("userId"));
    })
    
    document.querySelector("#searchIcon").addEventListener("click", renderSearchView);
    document.querySelector("#addIcon").addEventListener("click", renderCreateReviewView);
    return;
}

async function renderDiscoverView() {
    const allOverlaysOpen = document.querySelectorAll(".overlayReview");
    if (allOverlaysOpen.length > 0) { allOverlaysOpen.forEach(overlay => overlay.remove()); }

    document.querySelector("#contentContainer").innerHTML = "";

    const userId = localStorage.getItem("userId");

    // switch css files
    document.querySelector("#css1").setAttribute("href", "../css/loggedInBasicLayout.css");
    document.querySelector("#css2").setAttribute("href", "../css/discover.css");
    startLoadingScreen(document.querySelector("main"));
    // fetch logged in user to get following ids
    const responseUser = await fetch(new Request(`../server/getUser.php/?id=${userId}`));
    const userData = await responseUser.json();
    const followingIds = userData.userSocial.following;

    const titleElement = document.createElement("p");
    titleElement.setAttribute('id', 'discoverTitle');
    titleElement.textContent = "DISCOVER";
    document.querySelector("#contentContainer").prepend(titleElement);

    // check if the user follows anyone
    if (followingIds.length === 0) {
        document.querySelector("#contentContainer").innerHTML = `<p id="message">It seems like you're not following anyone...</p>`;
    } else {

        const allFollowingUsersReviews = [];

        // get reviews of all following users by their ids, one user at a time
        for (const followingUserId of followingIds) {

            const reviewsOneUser = await getReviews(followingUserId);

            if (reviewsOneUser.length === 0) {
                continue;
            }

            reviewsOneUser.forEach(review => {
                allFollowingUsersReviews.push(review);
            });
        }

        if (allFollowingUsersReviews.length === 0) {
            document.querySelector("#contentContainer").innerHTML = `<p id="message">It seems like there are no reviews to show...</p>`;
        } else {

            allFollowingUsersReviews.sort((a, b) => b.timestamp - a.timestamp);

            // go through all reviews to create them
            allFollowingUsersReviews.forEach(review => {
                makeReview(review, "#contentContainer");
            });

            document.querySelectorAll(`.review`).forEach(review => review.addEventListener("click", expandReview));
        }
    }
    stopLoadingScreen();

};

async function renderCreateReviewView(album) {
    const allOverlaysOpen = document.querySelectorAll(".overlayReview");
    if (allOverlaysOpen.length > 0) { allOverlaysOpen.forEach(overlay => overlay.remove()); }
    // Get user boards
    const userId = localStorage.getItem("userId");
    const response = await fetch(`/server/getUser.php?id=${userId}`);
    const userData = await response.json();
    const usersBoards = userData.albumData.boards;

    // CSS Change
    document.querySelector("#css2").setAttribute("href", "/css/create.css");

    const contentContainer = document.querySelector("#contentContainer");
    contentContainer.innerHTML = "";
    let html =
        `
        <div id="createContainer" class="">
            <div class="horizontalContainer">
                <div class="verticalContainer alignCenter">
                    <button id="createBoard" class="selectButton"></button>
                    <p>New board</p>
                </div>
                <div class="verticalContainer alignCenter">
                    <button id="createReview" class="selectButton disabled"></button>
                    <p>New review</p>
                </div>
            </div>
        </div>
    `;
    // <input type="text" placeholder="Album, Artist" id="searchField">   
    contentContainer.innerHTML = html;
    createContainer = contentContainer.querySelector("#createContainer");
    const createBoardDom = contentContainer.querySelector("#createBoard");
    const createReviewDom = contentContainer.querySelector("#createReview");
    // If album chosen then render create a new review section;
    if (album) { if (album.reviewDirectly) { renderCreateReview(album) } }
    // Check if user have a board to which to add reviews to else they must first create a board
    if (usersBoards.length > 0) {
        createReviewDom.classList.remove("disabled");
        createReviewDom.addEventListener("click", renderSearchView);
    };
    // Render create a new board section; Flytta till functions? men det är samtidigt en egen component
    createBoardDom.addEventListener("click", renderCreateBoard)
    function renderCreateBoard() {
        html =
            `
        <form id="uploadWrapper" data-type="board">
            <div id="imageUploaderContainer">
                <img id="imagePreview" src=""></img>
                <input type="file" id="imageUploader" accept="image/*" name="imageInput">
            </div>
            <input type="text" id="searchField" name="nameInput" placeholder="Choose name for your board" autocomplete="off">
            <input name="userId" style="display:none" value="${userId}">
        </form>
        <div class="horizontalContainer">
            <button id="goBackButton" class="navigationButton">Go back</button>
            <button for="uploadWrapper" id="createButton" class="navigationButton disabled">Create</button>
        </div>
        `;
        createContainer.innerHTML = html;
        createContainer.classList.add("board");
        // consts
        const imageUploader = createContainer.querySelector("#imageUploader");
        const imagePreview = createContainer.querySelector("#imagePreview");
        const boardNameInput = createContainer.querySelector("#searchField");
        const backButton = createContainer.querySelector("#goBackButton");
        const createButton = createContainer.querySelector("#createButton");
        createButton.addEventListener("click", (e) => { e.preventDefault() });
        backButton.addEventListener("click", (e) => { e.preventDefault() });
        // Show image preview
        imageUploader.onchange = evt => {
            const [file] = imageUploader.files;
            if (file) {
                imagePreview.classList.add("imageUploaded");
                imagePreview.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
            }
        };
        // allow create if inputfield is not empy
        boardNameInput.addEventListener("keyup", (e) => {
            const input = e.target.value;
            if (!input) {
                createButton.classList.add("disabled");
                createButton.removeEventListener("click", addBoard);
                return
            }
            createButton.classList.remove("disabled");
            createButton.addEventListener("click", addBoard)

        })
        function addBoard(e) {
            e.preventDefault();
            const formWrapper = createContainer.querySelector("form");
            const formData = new FormData(formWrapper);
            addBoardOrReview(formData);
        }
        backButton.addEventListener("click", renderCreateReviewView);
    }
};

// Add a new review or board function
async function addBoardOrReview(bodyData) {
    const uploadWrapper = document.querySelector("#uploadWrapper");
    startLoadingScreen(document.querySelector("main"));
    if (uploadWrapper.dataset.type === "review") {

        const request = new Request("/server/addBoardOrReview.php", {
            header: "Content-Type: application/json",
            method: "POST",
            body: JSON.stringify(bodyData),
        });
        const response = await fetch(request);
        const resource = await response.json();
        stopLoadingScreen();
        sendResponseMessage(resource.message, response.status);
    }


    if (uploadWrapper.dataset.type === "board") {
        const request = new Request("/server/addBoardOrReview.php", {
            header: "Content-Type: application/json",
            method: "POST",
            body: bodyData,
        });
        const response = await fetch(request);
        const resource = await response.json();
        stopLoadingScreen();
        sendResponseMessage(resource.message, response.status);
    }
}

function renderProfileView(userId) {
    const allOverlaysOpen = document.querySelectorAll(".overlayReview");
    if (allOverlaysOpen.length > 0) { allOverlaysOpen.forEach(overlay => overlay.remove()); }

    startLoadingScreen(document.querySelector("main"));

    const clickedUserId = userId;
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
            const userReviews = user.albumData.reviews.length;
            const displayName = user.userIdentity.displayName;


            document.querySelector("#contentContainer").innerHTML = `
                <div id="profileHeader">
                    <div>
                        <div id="profilePictureTop""></div>
                        <p>@${displayName}</p>
                    </div> 
                    <div id="headerRightContainer">
                        <div id="followingFollowersReviews">
                            <div>Reviews</div>
                            <div>${userReviews}</div>
                            <div>Followers</div>
                            <div id="followers">${userFollowers}</div>
                            <div>Following</div>
                            <div id="following">${userFollowing}</div>
                        </div>
                        <div id="profileIconsOrFollowButton"></div>
                    </div>
                    
                </div>
                <div id="boardAndReviewContainer">
                    <h2 id="title">BOARDS</h2>
                    <div id="boardContainer"></div>
                </div>`;

            // add profile picture
            if (profilePicture === "" || profilePicture === undefined || profilePicture === null) {

                document.querySelector(`#profilePictureTop`).style.backgroundImage = `url(/media/default.png)`;
            } else {

                document.querySelector(`#profilePictureTop`).style.backgroundImage = `url(/media/usersMedia/${user.userIdentity.id}/${profilePicture})`;
            }

            // check if logged in: follow button or icons
            if (clickedUserId !== loggedInUserId) {

                const followers = user.userSocial.followers;

                if (followers.includes(loggedInUserId)) {

                    document.querySelector("#profileIconsOrFollowButton").innerHTML = `
                    <button id="followButton">Following</button>`;

                } else {

                    document.querySelector("#profileIconsOrFollowButton").innerHTML = `
                    <button id="followButton">Follow</button>`;
                }

                document.querySelector("#profileIconsOrFollowButton").addEventListener("click", (e) => {
                    followUnfollow(user, e.target);
                });
            } else {
                document.querySelector("#profileIconsOrFollowButton").innerHTML = `
                <div class="settingsDropdown">
                    <div id="settingsIcon" class="headerIcon"></div>
                    <div id="dropdownContent" class="closed">
                        <div id="editAccountBtn" class="pointer">Edit Account</div>
                        <div id="logOutBtn" class="pointer">Log Out</div>
                    </div>
                </div>                            
                <div id="bookmarkIcon" class="headerIcon"></div>
                <div id="boardIcon" class="headerIcon"></div>
                `;

                document.querySelector("#settingsIcon").addEventListener("click", openCloseSettings);
                document.querySelector("#logOutBtn").addEventListener("click", e => {
                    renderLoginPage();
                })
                document.querySelector("#bookmarkIcon").addEventListener("click", (e) => showFavourites);
                document.querySelector("#bookmarkIcon").addEventListener("click", showFavourites);
                const editAccountBtn = document.querySelector("#editAccountBtn");
                editAccountBtn.addEventListener("click", editAccount);

                document.addEventListener("click", (e) => {
                    if (document.querySelector("#settingsIcon")) {
                        if (e.target != document.querySelector("#settingsIcon")) {
                            document.querySelector("#dropdownContent").classList.add("closed")
                        };
                    }
                })
                function openCloseSettings(e) { document.querySelector("#dropdownContent").classList.toggle("closed") };

                document.querySelector("#boardIcon").dataset.userId = clickedUserId;

                document.querySelector("#boardIcon").addEventListener("click", ()=>{
                    renderProfileView(clickedUserId);
                });

            }

            // add boards
            const boards = user.albumData.boards;


            boards.forEach(board => {

                const newBoard = document.createElement("div");
                newBoard.classList.add("board");
                newBoard.dataset.boardId = board.boardId;
                newBoard.dataset.boardName = board.boardName;

                newBoard.innerHTML = `
                    <div class="boardCover"></div>
                    <p class="boardName">${board.boardName}</p>`;

                document.querySelector("#boardContainer").append(newBoard);

                // set board thumbnail
                if (board.thumbnail === "" || board.thumbnail === undefined || board.thumbnail === null || board.thumbnail === "defaultBoardImage.jpg") {

                    newBoard.querySelector(".boardCover").style.backgroundImage = "url(../media/icons/board.svg)";
                } else {

                    newBoard.querySelector(".boardCover").style.backgroundImage = `url(/media/usersMedia/${user.userIdentity.id}/boards/${board.thumbnail}`;
                }

                newBoard.addEventListener("click", (e) => {
                    openBoard(user, e.currentTarget, clickedUserId);
                });
            });

            stopLoadingScreen(document.querySelector("main"));

        });


};

function followUnfollow(user, eventTarget) {


    try {

        fetch(new Request("/server/follow.php", {
            headers: { "Content-type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                id: user.userIdentity.id,
                currentUserId: localStorage.userId
            }),
        }));

    } catch (error) { sendMessageToUser("Server Error") }

    if (eventTarget.textContent === "Follow") {
        eventTarget.textContent = "Following";
        const followers = parseInt(document.querySelector("#followers").textContent);
        const newFollowersNumber = followers + 1;
        document.querySelector("#followers").textContent = newFollowersNumber;

    } else {
        eventTarget.textContent = "Follow";
        const followers = parseInt(document.querySelector("#followers").textContent);
        const newFollowersNumber = followers - 1;
        document.querySelector("#followers").textContent = newFollowersNumber;
    }

};

async function showFavourites() {
    const user = await getUserData(localStorage.getItem("userId"));

    document.querySelector("#boardAndReviewContainer").innerHTML = `
    <h1 id="title">SAVED</h1>
    <div id="favourites"></div>`;

    const arrayWithFavourites = user.albumData.favourites;

    if (arrayWithFavourites.length === 0) {
        document.querySelector("#favourites").innerHTML += "<p>No saved albums</p>";
    } else {

        arrayWithFavourites.forEach(favourite => {

            const newFavourite = document.createElement("div");
            newFavourite.classList.add("favourite");
            newFavourite.innerHTML = `
                <img class="favouriteCover"></img>
            <div id="favouriteInfoContainer">
                <p class="favouriteAlbumName">${favourite.albumName}</p>
                <p class="favouriteArtist">${favourite.artist}</p>
            </div>
            <button class="savedButton"></button>`;

            document.querySelector("#favourites").append(newFavourite);
            newFavourite.querySelector(".favouriteCover").style.backgroundImage = `url(${favourite.albumCover})`;
            const saveButton = newFavourite.querySelector(".savedButton");
            saveButton.addEventListener("click", () => {
                addToListenList(favourite, saveButton)
            })
        });
    }

};

function openBoard(user, eventCurrentTarget, clickedUserId) {



    const loggedInUserId = localStorage.getItem("userId");

    document.querySelector("#boardAndReviewContainer").innerHTML = `
    <h2 id="title">${eventCurrentTarget.dataset.boardName}</h2>`;

    const reviewsInBoard = [];

    user.albumData.boards.forEach(board => {

        if (board.boardId == eventCurrentTarget.dataset.boardId) {

            const boardId = board.boardId;
            const arrayWithReviews = user.albumData.reviews;

            if (board.reviews.length === 0) {
                document.querySelector("#boardAndReviewContainer").innerHTML += "<p>There are no reviews in this board yet...</p>";
            }

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
    document.querySelectorAll(".review > who").forEach(element => element.textContent = `@${review.displayName}`);



    if (clickedUserId === loggedInUserId) {
        document.querySelectorAll(".review").forEach(review => {

            const reviewId = review.dataset.reviewId;

            const newElement = document.createElement("div");
            newElement.classList.add("deleteBtn");
            review.prepend(newElement);


            newElement.dataset.reviewId = reviewId;

        });


        document.querySelectorAll(".deleteBtn").forEach(button => {

            button.addEventListener("click", event1 => {
                event1.stopPropagation();

                const popUp = document.createElement("div");

                popUp.id = "popUp";

                popUp.innerHTML = ` 
                    <p>Are you sure you want to delete this review?</p>
                    <div>
                        <div id="cancelBtn">Cancel</div>
                        <div id="continueBtn">Continue</div>
                    </div>`;

                document.querySelector("#contentContainer").prepend(popUp);

                document.querySelector("#cancelBtn").addEventListener("click", hidePopUp);
                document.querySelector("#continueBtn").addEventListener("click", event => {
                    event1.target.parentElement.remove();
                    deleteReview(event.target.dataset.reviewId);
                    hidePopUp();
                });
                document.querySelector("#continueBtn").dataset.reviewId = event.currentTarget.dataset.reviewId;
            });

        });



    }

    document.querySelectorAll(".review").forEach(review => {
        review.addEventListener("click", expandReview);
    })

}

async function expandReview(event) {

    document.querySelector("#css1").setAttribute("href", "../css/loggedInBasicLayout.css");
    document.querySelector("#css3").setAttribute("href", "../css/expandedReview.css");
    const overlayContainer = document.createElement("div");
    overlayContainer.classList.add("overlayReview");

    document.querySelector("main").append(overlayContainer);


    const clickedUserId = event.currentTarget.dataset.userId;
    const clickedReviewId = event.currentTarget.dataset.reviewId;
    const albumId = event.currentTarget.dataset.albumId;

    const reviewsOfClickedUser = await fetchReview(clickedUserId);

    reviewsOfClickedUser.forEach(async (firstLoopThroughReview) => {

        if (clickedReviewId == firstLoopThroughReview.reviewId) {

            overlayContainer.innerHTML = `
                
                <div id="closeReview" class="pointer"></div>
                <p id="timestampExpanded"><span>${timeConverter(firstLoopThroughReview.timestamp)}</span></p>
                <p id="displayNameExpanded"><span class="bold pointer">@${firstLoopThroughReview.displayName}</span> reviewed</p>
                <p id="albumNameExpanded">${firstLoopThroughReview.albumName}</p>
                <p id="artistExpanded">${firstLoopThroughReview.artist}</p>
                <div class="albumCoverContainer">
                    <button id="bookmark" class="saveButton" alt="Bookmark"></button>
                    <img src="${firstLoopThroughReview.albumCover}" alt="Album Cover" id="albumCoverExpanded">
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
                <div class="previousReviewsContainer"></div>`;

            fillStars(firstLoopThroughReview.rating, overlayContainer);

            document.querySelector("#displayNameExpanded").dataset.userId = firstLoopThroughReview.userId;

            document.querySelector(`#displayNameExpanded`).addEventListener("click", ()=>{
                renderProfileView(clickedUserId);
            });
            overlayContainer.querySelector(`#closeReview`).addEventListener("click", (e) => {
                const allReviewsOpen = document.querySelectorAll(".overlayReview");
                if (allReviewsOpen.length === 1) {
                    document.querySelector("#css3").setAttribute("href", "");
                }
                overlayContainer.remove();
            });
            const saveButton = document.querySelector("#bookmark");
            const userData = await getUserData(localStorage.getItem("userId"));
            const usersAlbumList = userData.albumData.favourites;
            usersAlbumList.forEach(listItem => {
                if (listItem.albumId === albumId) {
                    saveButton.classList.remove("saveButton");
                    saveButton.classList.add("savedButton");
                }
            });
            saveButton.addEventListener("click", () => {
                addToListenList(firstLoopThroughReview, saveButton);
            })

            // previous reviews
            const response = await fetch(`/server/getReviews.php/?albumId=${albumId}`);
            const resource = await response.json();
            const allReviewsOfAlbum = resource.reviews;

            // exclude the current one
            for (let i = 0; i < allReviewsOfAlbum.length; i++) {
                const review = allReviewsOfAlbum[i];

                if (review.userId === clickedUserId) {
                    allReviewsOfAlbum.splice(i, 1);
                }
            }


            //kolla om det inte finns några
            if (allReviewsOfAlbum.length === 0) {
                overlayContainer.querySelector(".previousReviewsContainer").innerHTML = "<p>No other reviews yet...</p>";
            } else {
                allReviewsOfAlbum.forEach(review => {


                    // shorten comment if needed
                    let reviewDescription = review.reviewDescription;
                    if (reviewDescription.length > 70) {
                        reviewDescription = reviewDescription.slice(0, 70) + "...";
                    }

                    // make html for new review
                    const newReview = document.createElement("div");
                    newReview.id = review.reviewId
                    newReview.innerHTML = `
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
                        `;

                    // add new review to html
                    overlayContainer.querySelector(".previousReviewsContainer").append(newReview);
                    newReview.dataset.userId = review.userId;
                    newReview.dataset.reviewId = review.reviewId;
                    newReview.dataset.albumId = review.albumId;
                    newReview.classList.add("review");

                    fillStars(review.rating, newReview);

                    //profilbilderna funkar inte

                    newReview.addEventListener("click", e => expandReview(e));

                }

                )

            }

        }
    })

};

