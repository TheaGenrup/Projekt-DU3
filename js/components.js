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
    document.querySelector("#css1").setAttribute("href", "/css/register_login.css");
    return
}

function renderLoggedInView(profilePic) {

    document.querySelector("body").innerHTML = `

    <main>
    <dialog data-modal id="overlay">
    </dialog>
    <div id="searchWindow">
        <div id="usersUlContainer">
            <ul id="usersUl">
            </ul>
        </div>
        <div id="albumUlContainer">
            <ul id="albumUl">
            </ul>
        </div>
    </div>

    <div id="contentContainer">
    </div>
    </main>
    <nav>
        <img class="view_icon" id="discover_icon" src="/media/icons/discover.png" alt="Discover"></img>
        <img class="view_icon" id="openSearchWindowBtn" src="/media/icons/search.png" alt="Search"></img>
        <img class="view_icon" id="addBtn" src="/media/icons/add.png" alt="Add"></img>
        <img class="view_icon" id="profile_picture" src="../media/${profilePic}" alt="Profile"></img>
        <div id="searchFieldContainer">
            <img id="closeSearchWindowBtn" src="/media/icons/close_0.png" alt="">
            <input id="searchField" type="text" placeholder="Search albums and users"></input>
        </div>
    </nav>
    `;

    document.querySelector("#discover_icon").addEventListener("click", renderDiscoverView);
    document.querySelector("#profile_picture").addEventListener("click", renderProfileView);

    const openSearchWindowBtn = document.querySelector("#openSearchWindowBtn");
    const closeSearchWindowBtn = document.querySelector("#closeSearchWindowBtn");
    const searchField = document.querySelector("#searchField");
    const addBtn = document.querySelector("#addBtn");




        // DOM Event listeners
        openSearchWindowBtn.addEventListener("click", openSearchWindow);
        closeSearchWindowBtn.addEventListener("click", closeSearchWindow);
        searchField.addEventListener("keyup", searchAlbums);
        searchField.addEventListener("keyup", searchUsers);
        addBtn.addEventListener("click", createBoardOrReview)
        document.querySelector("#css1").setAttribute("href", "/css/logged_in_basic_layout.css");
        document.querySelector("#css3").setAttribute("href", "/css/search.css");
        document.querySelector("#css4").setAttribute("href", "/css/createBoardOrReview.css");
        return;
}

// Render Logged in view
/*
function renderLoggedInView(userIdentity) {
    const html = `
    <main id="mainContainer">
    <dialog data-modal id="overlay">
    </dialog>

        <div id="contentContainer">
            <div id="searchWindow">
                <div id="usersUlContainer">
                    <ul id="usersUl">
                    </ul>
                </div>
                <div id="albumUlContainer">
                    <ul id="albumUl">
                    </ul>
                </div>
            </div>
        </div>
    </main>
    <nav>
        <img class="view_icon" src="/media/icons/discover.png" alt="Discover"></img>
        <img class="view_icon" id="openSearchWindowBtn" src="/media/icons/search.png" alt="Search"></img>
        <img class="view_icon" id="addBtn" src="/media/icons/add.png" alt="Add"></img>
        <img class="view_icon" id="profile_picture" src="/media/icons/${userIdentity.profilePic}.png" alt="Profile"></img>
        <div class="view_icon" id="logoutBtn">logout</div>
        <div id="searchFieldContainer">
            <img id="closeSearchWindowBtn" src="/media/icons/close_0.png" alt="">
            <input id="searchField" type="text" placeholder="Search albums and users"></input>
        </div>
    </nav>
    `;
    document.body.innerHTML = html;
    // DOM elements used
    const logoutBtn = document.querySelector("#logoutBtn");
    const openSearchWindowBtn = document.querySelector("#openSearchWindowBtn");
    const closeSearchWindowBtn = document.querySelector("#closeSearchWindowBtn");
    const searchField = document.querySelector("#searchField");
    const addBtn = document.querySelector("#addBtn");
    
    // DOM Event listeners
    logoutBtn.addEventListener("click", renderLoginPage);
    openSearchWindowBtn.addEventListener("click", openSearchWindow);
    closeSearchWindowBtn.addEventListener("click", closeSearchWindow);
    searchField.addEventListener("keyup", searchAlbums);
    searchField.addEventListener("keyup", searchUsers);
    addBtn.addEventListener("click", createBoardOrReview)
    document.querySelector("#css1").setAttribute("href", "/css/logged_in_basic_layout.css");
    document.querySelector("#css2").setAttribute("href", "/css/search.css");
    document.querySelector("#profile_picture").src = userIdentity.profilePic;
    return;

}
*/

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

        document.querySelector("#contentContainer").innerHTML = `<p id="no_following">It seems like you're not following anyone...</p>`;
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
            document.querySelector("#contentContainer").innerHTML += newReview;

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

            document.querySelector("#contentContainer").innerHTML = `
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
                                <div id="dropdown_content" class="closed">
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

            /*             document.querySelector("#settings_icon").addEventListener("click", e => {
                            document.querySelector("#dropdown_content").style.display = "block";
                        }); */
            document.querySelector("#settings_icon").addEventListener("click", e => document.querySelector("#dropdown_content").classList.toggle("closed"));
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
    document.querySelector("#contentContainer").innerHTML = "";

    const userId = event.currentTarget.dataset.userId;
    const reviewId = event.currentTarget.dataset.reviewId;

    const reviews = await fetchReview(userId);


    reviews.forEach(review => {

        if (reviewId == review.reviewId) {

            document.querySelector("#contentContainer").innerHTML = `
                
                <div id="close_review"></div>
                <p id="timestamp"><span>${timeConverter(review.timestamp)}</span></p>
                <p id="display_name"><span class="bold pointer">@${review.displayName}</span> reviewed</p>
                <p id="album_name">${review.albumName}</p>
                <p id="artist">${review.artist}</p>
                <div class="album_cover_container">
                    <img src="/media/icons/bookmark.png" id="bookmark" alt="Bookmark">
                    <img src="../media/albumCovers/${review.albumCover}" alt="Album Cover" 
                    
                    id="album_cover_expanded">
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
