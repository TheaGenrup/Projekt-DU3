function renderLoggedInView(activeTab) {

    document.querySelector("body").innerHTML = `
    <header>
        <div id="laulu">LAULU</div>
        <div id="search_icon"></div>
    </header>
    <main>
        <div id="tabs">
            <div class="tab">DISCOVER</div>
            <div class="tab">MY PROFILE</div>
        </div>
        <div id="main_block"></div>
    </main>
    `


    document.querySelectorAll(".tab").forEach(tab => {

        if (tab.textContent.toLowerCase().replace(" ", "") == activeTab.toLowerCase()) {
            tab.classList.add("active")
        } else {
            tab.classList.add("inactive")
        }
    });

}

renderLoggedInView("myProfile");


function renderProfileView(userInfo) {

    const profile_picture = userInfo[0].userIdentity.profilePic;
    const user_followers = userInfo[0].userSocial.following.length;
    const user_following = userInfo[0].userSocial.followers.length;
    const username = userInfo[0].userCredentials.userName;

    const html = document.querySelector("#main_block").innerHTML = `
    <header id="profile_header">
        <div>
            <div id="profile_picture">
                <img src="${profile_picture}">
            </div>
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
            <h1>BOARDS</h1>
            <div id="Board_of_boards"></div>
        </div>
    </main>
    `
}

const user = [
    {
        "userCredentials": {
            "userName": "Elinsauer",
            "password": "Elin älskar riskakor"
        },
        "loginKey": "",
        "userSocial": {
            "following": [
                "e4123412jndnjd",
                "1234513451dgdng",
                "12345654gdwdg",
                "1234514gdwd"
            ],
            "followers": [
                "e4123412jndnjd",
                "1234513451dgdng",
                "12345654gdwdg",
                "1234514gdwd"
            ]
        },
        "userIdentity": {
            "id": "12341431234fdjdidd",
            "profilePic": "1241345512514",
            "displayName": "Anthony Fantano"
        },
        "reviews": [
            {
                "albumName": "Infest the Rat's nest",
                "artist": "King Gizzard and the lizzard wizard",
                "albumId": "5Bz2LxOp0wz7ov0T9WiRmc",
                "reviewId": 0,
                "reviewDescription": "I like when the music is making noise",
                "rating": 5
            }
        ]
    }
]

renderProfileView(user);