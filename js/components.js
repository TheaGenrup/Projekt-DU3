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
                        <input type="text" id="passwordInput" placeholder="password">
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

        document.querySelectorAll(`.review`).forEach(review => { review.addEventListener("click", expandReview); });
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
            <input type="text" id="searchField" placeholder="Album, Artist, user" autocomplete="off">
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

async function renderCreateReviewView() {
    // Get user boards
    const userId = localStorage.getItem("userId");
    const response = await fetch(`/server/getUser.php?id=${userId}`);
    const userData = await response.json();
    const usersBoards = userData.albumData.boards;

    // CSS Change
    document.querySelector("#css2").setAttribute("href", "/css/create.css");


    const contentContainer = document.querySelector("#contentContainer");
    contentContainer.innerHTML ="";
    let html =
    `
        <h3>Add a new Board</h3>
        <div id="createContainer" class="">
            <div class="horizontalContainer">
                <button id="createBoard" class="selectButton">New Board</button>
                <button id="createReview" class="selectButton disabled">New Review</button>
            </div>
        </div>
    `;
    // <input type="text" placeholder="Album, Artist" id="searchField">   
    contentContainer.innerHTML = html;
    createContainer = contentContainer.querySelector("#createContainer");
    const createBoardDom = contentContainer.querySelector("#createBoard");
    const createReviewDom = contentContainer.querySelector("#createReview");
            // Check if user have a board to which to add reviews to else they must first create a board
    if (usersBoards.length > 0) { createReviewDom.classList.remove("disabled");
        createReviewDom.addEventListener("click", renderCreateReview);
    };
            // Render create a new board section; Flytta till functions? men det är samtidigt en egen component
    createBoardDom.addEventListener("click", renderCreateBoard)
    function renderCreateBoard() {
        html = 
        `
            <form id="uploadWrapper" class="board">
            <input type="text" id="searchField" name="nameInput" placeholder="Name your board queen yas..." autocomplete="off">
            <input name="userId" style="display:none" value="${userId}">

            <div id="imageUploaderContainer">
                <img id="imagePreview" src=""></img>
                <input type="file" id="imageUploader" accept="image/*" name="imageInput">
            </div>
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
        createButton.addEventListener("click", (e)=>{ e.preventDefault()});
        backButton.addEventListener("click", (e)=>{ e.preventDefault()});
        // Show image preview
        imageUploader.onchange = evt => {
            const [file] = imageUploader.files;
            if (file) {
                imagePreview.classList.add("imageUploaded");
                imagePreview.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
            }
        };
        // allow create if inputfield is not empy
        boardNameInput.addEventListener("keyup", (e)=>{
            const input = e.target.value;
            if (!input) {
                createButton.classList.add("disabled");
                createButton.removeEventListener("click", addBoardOrReview);
                return
            }
            createButton.classList.remove("disabled");
            createButton.addEventListener("click", addBoardOrReview)

        })
        backButton.addEventListener("click", renderCreateReviewView);
    }





/*

    Album namn / artist / bild
    välj
    beskrivning
    rating


            <input type="text" id="searchField" name="nameInput" placeholder="Name your board queen yas...">
            <input name="userId" style="display:none" value="${userId}">

            <div id="imageUploaderContainer">
                <img id="imagePreview" src=""></img>
                <input type="file" id="imageUploader" accept="image/*" name="imageInput">
            </div>

*/





    // Render create a new review section;
    async function renderCreateReview() {
        token = await fetchToken();
        html = 
        `
        <div id="searchContainer">
            <input id="searchField" placeholder="search album..." autocomplete="off">
            <ul id="albumUl" data-set="chooseAlbum"></ul>
        </div>
        <form id="uploadWrapper" class="review">
            <div id="chooseBoardContainer">
                <label for="chooseBoard">Choose board</label>
                <select id="selectBoard">
                </select>
            </div>

            <div class="horizontalContainer">
                <div class="verticalContainer">
                    <p id="chosenArtist">Artist:</p>
                    <p id="chosenAlbum">Album:</p>
                </div>
                <img src="" id="albumImagePreview">
            </div>

            <div id="rateAlbumContainer" class="open">
                <label for="">Album rating</label>
                <div id="chooseRatingContainer">
                    <div data-rating="1"></div>
                    <div data-rating="2"></div>
                    <div data-rating="3"></div>
                    <div data-rating="4"></div>
                    <div data-rating="5"></div>
                </div>
            </div>

            <div class="open">
                <label for="">ReviewDescription</label>
                <textarea name="" id="reviewDescription" cols="30" rows="10"></textarea>
            </div>
        </form>

        <div class="horizontalContainer">
            <button id="goBackButton" class="navigationButton">Go back</button>
            <button for="uploadWrapper" id="createButton" class="navigationButton disabled">Create</button>
        </div>  
        `;
        createContainer.innerHTML = html;
        createContainer.classList.add("board");
        // consts
        const albumSearchField = document.querySelector("#searchField");
        const albumUl = createContainer.querySelector("#albumUl");
        const selectBoard = document.querySelector("#selectBoard");
        const backButton = createContainer.querySelector("#goBackButton");
        const createButton = createContainer.querySelector("#createButton");
        const starRatings = createContainer.querySelectorAll("#chooseRatingContainer div");
        // Event listener
        // Prevent default for submitting forms
        createButton.addEventListener("click", (e)=>{ e.preventDefault()});
        backButton.addEventListener("click", (e)=>{ e.preventDefault()});
        // Select album from ul 
        albumUl.addEventListener("resize", ()=> {
            console.log("test");
        })
        //Add boards to list of options
        usersBoards.forEach(board => {
            const optionDom = document.createElement("option");
            optionDom.value = board.boardName;
            optionDom.textContent = board.boardName;
            selectBoard.append(optionDom);
        });
        //Star rating function
        starRatings.forEach(star => {
            //star.addEventListener("click", chooseRating)
            star.addEventListener("mouseover", (e) => {
                const index = parseInt(e.target.dataset.rating);
                const starRatings = e.target.parentElement.querySelectorAll("div");
                starRatings.forEach(star => {
                    star.style.backgroundImage = "url(/media/icons/star-regular.svg)";
                });
                for (let i = 0; i < index; i++) {
                    starRatings[i].style.backgroundImage = "url(/media/icons/star-solid.svg)";
                    
                }
            });
            star.addEventListener("mouseleave", (e) => {
                const starRatings = e.target.parentElement.querySelectorAll("div");
                starRatings.forEach(star => {
                    if (!star.classList.contains("chosen")) {
                        star.style.backgroundImage = "url(/media/icons/star-regular.svg)";
                        starRatings[0].style.backgroundImage = "url(/media/icons/star-solid.svg)";
                    }
                });
            });
            star.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.rating);
                const starRatings = e.target.parentElement.querySelectorAll("div");
                starRatings.forEach(star => {
                    star.classList.remove("chosen");
                });
                for (let i = 0; i < index; i++) {
                    starRatings[i].style.backgroundImage = "url(/media/icons/star-solid.svg)";
                    starRatings[i].classList.add("chosen");
                }
            });
        });
        albumSearchField.addEventListener("keyup", searchAlbums);
        // Close search list when clicking outside it
        document.addEventListener("click", (e)=>{
            const searchContainer = document.querySelector("#searchContainer");
            if (e.target.parentElement != searchContainer ) {
                clearSearch();
            }
        });

        // allow create if inputfield is not empy
        /*
        boardNameInput.addEventListener("keyup", (e)=>{
            const input = e.target.value;
            if (!input) {
                createButton.classList.add("disabled");
                createButton.removeEventListener("click", addBoardOrReview);
                return
            }
            createButton.classList.remove("disabled");
            createButton.addEventListener("click", addBoardOrReview)

        })
        */
        backButton.addEventListener("click", renderCreateReviewView);



        // functions

    }


/*

    starRatings.forEach(star => {
        star.addEventListener("click", chooseRating)
        star.addEventListener("mouseover", starHoverEffect)
    });

    searchAlbumInput.addEventListener("keyup", searchAlbums);
    createNewBoardBtn.addEventListener("click", showCreateNewBoard);
    createNewReviewBtn.addEventListener("click", showCreateNewReview);




*/

















    // Add a new review or board function
    function addBoardOrReview(e) {
        e.preventDefault();
        if (createContainer.classList.contains("board")) {
            const formWrapper = createContainer.querySelector("form");
            const formData = new FormData(formWrapper);
            console.log(formData);
            const request = new Request("/server/addBoardOrReview.php",{
                method:"POST",
                body: formData
            });

            fetch (request)
                .then(response => {
                    console.log(response);
                    return response.json();
                })
                .then(r => {
                    console.log(r);
                })
        }
    }

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
                <div id="addBoardIcon" class="pointer"></div>
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
};


/*
    om ingen board redan finns så måste man skapa en
    namn på board
    bild uppladdning



*/