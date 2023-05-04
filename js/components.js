"use strict";
// Render Login page, 
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
    document.querySelector("#style1").setAttribute("href", "/css/register_login.css");
}

// om du ska testa den här funktionen, glöm inte ladda rätt css_filer
// Render Logged in view
function renderLoggedInView(userIdentity) {
    const html = `
    <main id="mainContainer">
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
        <img class="view_icon" src="/media/icons/add.png" alt="Add"></img>
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
    
    // DOM Event listeners
    logoutBtn.addEventListener("click", renderLoginPage);
    openSearchWindowBtn.addEventListener("click", openSearchWindow);
    closeSearchWindowBtn.addEventListener("click", closeSearchWindow);
    searchField.addEventListener("keyup", searchAlbums);
    document.querySelector("#style1").setAttribute("href", "/css/logged_in_basic_layout.css");
    document.querySelector("#style2").setAttribute("href", "/css/search.css");
    document.querySelector("#profile_picture").src = userIdentity.profilePic;
    return;

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

function renderProfileView(userInfo) {

    const profile_picture = userInfo[0].userIdentity.profilePic;
    const user_followers = userInfo[0].userSocial.followers.length;
    const user_following = userInfo[0].userSocial.following.length;
    const username = userInfo[0].userCredentials.username;

    const profile_html = document.querySelector("#content_container").innerHTML = `
    <header id="profile_header">
        <div>
            <div id="profile_picture"></div>
            <p>@${username}</p>
        </div> 
        <div>
            <div id="following_followers">
                <div>Followers</div>
                <div>${user_followers}</div>
                <div>Following</div>
                <div>${user_following}</div>
            </div>
            <div>
                <div id="settings_icon"></div>
                <div id="bookmark_icon"></div>
                <div id="add_board_icon"></div>
            </div>
        </div>
    </header>
    <main>
        <div id="profile_main">
            <h2>BOARDS</h2>
            <div id="board_of_boards"></div>
        </div>
    </main>
    `

    document.querySelector("#profile_picture").style.backgroundImage = profile_picture;

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


const user = [{
    "userCredentials": {
        "username": "test2",
        "password": "test2"
    },
    "loginKey": "FEQTxo5ivVNyPi31ldS8Q9QbX",
    "userSocial": {
        "following": [],
        "followers": []
    },
    "userIdentity": {
        "id": "607133432034891031030642696328",
        "profilePic": "url(../media/mario.jpg)",
        "displayName": "test2"
    },
    "albumData": {
        "boards": [
            {
                "boardName": "Acid psychadelics",
                "boardId": 0,
                "reviews": [
                    0,
                    1
                ],
                "thumbnail": "\/server\/media\/users\/607133432034891031030642696328\/boards\/bildnamet"
            },
            {
                "boardName": "Håkan H",
                "boardId": 0,
                "reviews": [
                    0,
                    1
                ],
                "thumbnail": "\/server\/media\/users\/607133432034891031030642696328\/boards\/bildnamet"
            },
            {
                "boardName": "JAZZ",
                "boardId": 0,
                "reviews": [
                    0,
                    1
                ],
                "thumbnail": "\/server\/media\/users\/607133432034891031030642696328\/boards\/bildnamet"
            },
            {
                "boardName": "POP",
                "boardId": 0,
                "reviews": [
                    0,
                    1
                ],
                "thumbnail": "\/server\/media\/users\/607133432034891031030642696328\/boards\/bildnamet"
            }
        ],
        "reviews": [
            {
                "albumName": "Infest the Rat's nest",
                "artist": "King Gizzard and the lizzard wizard",
                "albumId": "5Bz2LxOp0wz7ov0T9WiRmc",
                "reviewId": 0,
                "reviewDescription": "I like when the music is making noise",
                "rating": 5,
                "boards": [
                    0
                ]
            },
            {
                "albumName": "The microphones pt2",
                "artist": "Mount eire",
                "albumId": "???",
                "reviewId": 1,
                "reviewDescription": "Woah! I've never cired like this before, except maybe when I saw the whale in theaters and I sat there bawling for like 2\/3 hours? Yeah great feeling.",
                "rating": 5,
                "boards": [
                    0
                ]
            }
        ],
        "favourites": [
            {
                "albumName": "The microphones pt2",
                "artist": "Mount eire",
                "albumId": "???",
                "favouriteId": 0
            }
        ]
    }
}];

//renderProfileView(user);
