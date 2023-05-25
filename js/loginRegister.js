"use strict";

checkIfAlreadyLoggedIn();
// Sticky login 
function checkIfAlreadyLoggedIn() {
    const key = localStorage.getItem("logInKey");
    if (key === undefined || key === null) {
        renderLoginPage();
        return
    } else {
        attemptLogin("", "", "Access-Key: Auth", key);
    }
}

// Switch between log in and register Section
function switchLoginRegsiter(e) {
    const switchBtn = document.querySelector("#switchBtn");
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
    const loginOrRegister = e.target.textContent;
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
        if (userData.message) { sendLoginPageMessage(userData.message); return }
        else { loginUser(userData); }
    }
    if (loginKey) {
        const userData = await fetchLogin(username, password, access, loginKey);
        if (userData === undefined) {
            localStorage.clear();
            renderLoginPage();
            return
        }
        if (!userData.userId) { renderLoginPage };

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
    if (response.status === 404) {
        localStorage.clear();
        renderLoginPage();
        return
    }
    const resource = await response.json();
    console.log(resource);
    return resource
}

function loginUser(userData) {

    localStorage.setItem("logInKey", userData.loginKey);
    localStorage.setItem("userId", userData.userIdentity.id);
    const profilePicture = userData.userIdentity.profilePic;

    renderLoggedInView(profilePicture);
    renderProfileView(localStorage.getItem("userId"));
}

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

    try {
        fetch(request, data)
            .then(response => {
                return response.json();
            })
            .then(r => {
                console.log(r);
                sendLoginPageMessage(r.message);

            })
    } catch (error) {
        sendLoginPageMessage("whoopsie, an error occured, please try again another time")
    }

}
// Message to user
function sendLoginPageMessage(message) {
    const loginRegistermessageDom = document.querySelector("#loginRegistermessage");
    loginRegistermessageDom.textContent = ""
    loginRegistermessageDom.style.opacity = "0%"
    loginRegistermessageDom.style.transition = "0s"
    loginRegistermessageDom.textContent = message
    loginRegistermessageDom.style.opacity = "100%"
    setTimeout(() => {
        loginRegistermessageDom.style.transition = "1.5s"
        loginRegistermessageDom.style.opacity = "0%"
    }, 6000)

}
function sendMessageToUser(DomElement, message) {
    DomElement.textContent = ""
    DomElement.style.opacity = "0%"
    DomElement.style.transition = "0s"
    DomElement.textContent = message
    DomElement.style.opacity = "100%"
    setTimeout(()=>{
        DomElement.style.transition = "1.5s"
        DomElement.style.opacity = "0%"
    }, 10000);
    DomElement.style.transition = "0s"
    return;
}
