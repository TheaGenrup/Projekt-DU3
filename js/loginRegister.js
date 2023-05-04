"use strict";
checkIfAlreadyLoggedIn();
function checkIfAlreadyLoggedIn() {
    const key = localStorage.getItem("logInKey");
    if (key === undefined || key === null) {
        renderLoginPage(); 
    } else {
        attemptLogin("", "", "Access-Key: Auth", key);
    }
};
// Switch between log in and register Section
function switchLoginRegsiter(e) {
    const switchBtn = e.target
    const loginRegisterbtn = document.querySelector("#loginRegisterBtn");
    const loginRegisterSwitchcontainer = document.querySelector("#loginRegisterSwitch");
    const text = loginRegisterSwitchcontainer.querySelector(".signupText");
    const loginAndRegisterForm = document.querySelector("#loginAndRegisterForm");
    const loginRegisterSign = document.querySelector("#loginRegisterSign");
    document.querySelector("#usernameInput").value = "";
    document.querySelector("#passwordInput").value = "";
    document.querySelector("#displaynameInput").value = "";
    if (loginAndRegisterForm.classList.contains("loginForm")) {
        loginAndRegisterForm.classList.remove("loginForm");
        loginAndRegisterForm.classList.add("registerForm");
        loginAndRegisterForm.style.transition = "1.8s";
        loginAndRegisterForm.style.bottom = "0px";
        text.textContent = "Already have an account? ";
        switchBtn.textContent = "Log in";
        loginRegisterbtn.textContent = "Register";
        loginRegisterSign.textContent = "Create an account"
    } else {
        loginAndRegisterForm.classList.add("loginForm");
        loginAndRegisterForm.classList.remove("registerForm");
        loginAndRegisterForm.style.transition = "1.8s"
        loginAndRegisterForm.style.bottom = "-75px"
        text.textContent = "Don't have an account? "
        switchBtn.textContent = "Sign up"
        loginRegisterbtn.textContent = "Log in";
        loginRegisterSign.textContent = "Login"
    }
}
//login and register button
function loginRegister(e) {
    e.preventDefault();
    const loginOrRegister = e.target.textContent
    if (loginOrRegister === "Log in") {
        const usernameInput = document.querySelector("#usernameInput").value;
        const passwordInput = document.querySelector("#passwordInput").value;
        attemptLogin(usernameInput, passwordInput, "Access-Login: Auth");
    }
    else if (loginOrRegister === "Register") {
        const usernameInput = document.querySelector("#usernameInput").value;
        const passwordInput = document.querySelector("#passwordInput").value;
        const displaynameInput = document.querySelector("#displaynameInput").value;
        registerUser(usernameInput, passwordInput, displaynameInput);
    }
}

//  Log in Section 
async function attemptLogin(username, password, access, loginKey) {
    if (!loginKey) {
        const userData = await fetchLogin(username, password, access);
        loginUser(userData);
    }
    if (loginKey) {
        const userData = await fetchLogin(username, password, access, loginKey);
        loginUser(userData);
    }

}
async function fetchLogin(username, password, access, loginKey) {
    const request = new Request(`/server/login.php`);
    const data = {
        headers: { "Content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({
            username: username,
            password: password,
            access: access,
            loginTokenKey: loginKey
        })
    }
    const response = await fetch(request, data);
    const resource = await response.json();
    return resource
}

function loginUser(userData) {
    localStorage.setItem("logInKey", userData.loginKey);
    console.log(userData);

    renderLoggedInView({
        profilePic: userData.profilePic,
    })

    // to do: sortera reviews efter datum och tid

    // renderDiscoverView(followingNewReviews);

}

// temporary call to function
/* loginUser({
    loginKey: "HkoZ87CbKB8dw6X990CT5hPye",
    profilePic: "../media/profile_picture.jpg",
},
    [
        {
            displayName: "Filip",
            date: "23-02-13",
            timestamp: "18:23",
            albumName: "Dreams",
            artist: "Fleetwood Mac",
            albumId: "5Bz2LxOp0wz7ov0T9WiRmc",
            reviewDescription: "I like when the music is making noise",
            rating: 4,
            reviewId: 34,
            albumCover: `url(../media/dreams.jpg)`,
        },
        {
            displayName: "Elin",
            date: "23-02-14",
            timestamp: "16:25",
            albumName: "Och stora havet",
            artist: "Jakob Hellman",
            albumId: "???",
            reviewDescription: "Woah! I've never cried like this before, except maybe when I saw the whale in theaters and I sat there bawling for like 2\/3 hours? Yeah great feeling.",
            rating: 5,
            reviewId: 31,
            albumCover: `url(../media/hellman.jpg)`,
        },
        {
            displayName: "Thea",
            date: "23-02-15",
            timestamp: "12:45",
            albumName: "Abbey Road",
            artist: "The Beatles",
            albumId: "???",
            reviewDescription: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem quod cum dolorum vel libero repellendus tempora, suscipit nam qui aliquid.",
            rating: 3,
            reviewId: 32,
            albumCover: `url(../media/beatles.jpg)`,
        },
        {
            displayName: "Thea",
            date: "23-02-17",
            timestamp: "17:54",
            albumName: "Och stora havet",
            artist: "Jakob Hellman",
            albumId: "???",
            reviewDescription: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem quod cum dolorum vel libero repellendus tempora, suscipit nam qui aliquid.",
            rating: 4,
            reviewId: 43,
            albumCover: `url(../media/beatles.jpg)`,
        }
    ]);
 */

/*
const server = "login";
const request = new Request (`server/login.php`);
const data = {
    headers: {"Content-type": "application/json"},
    method: "POST",
    body: JSON.stringify({
        username: "test",
        password: "test",
        access: "Access-Login: Auth / Access-Key: Auth"
    })
}

fetch(request, data)
.then(r=>{
    console.log(r);
    return r.json()
})
.then(r => {
    console.log(r);
})

Om allt går bra returneras användaren och dess info förutom dess användarnamn & lösenord
*/

// Register Section

function registerUser(username, password, displayname) {
    const request = new Request(`/server/register.php`);
    const data = {
        headers: { "Content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({
            username: username,
            password: password,
            displayName: displayname,
            access: "Access-Register: Auth"
        })
    }

    fetch(request, data)
        .then(r => {
            console.log(r);
            return r.json()
        })
        .then(r => {
            console.log(r);
        })

}