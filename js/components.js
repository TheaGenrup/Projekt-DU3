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

    const profile_picture = userInfo.userIdentity.profilePic;
    const user_followers = userInfo.userSocial.following.length;
    const user_following = userInfo.userSocial.followers.length;
    const username = userInfo.userCredentials.userName;

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
                <div id="saved_albums_icon"></div>
                <div id="add_board_icon"></div>
            </div>
        </div>
    </header>
    <main>
        <h1>BOARDS</h1>
        <div id="Board_of_boards"></div>
    </main>
    `
}