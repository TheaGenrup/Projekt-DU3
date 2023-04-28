//  checkIfAlreadyLoggedIn();
    // Switch between log in and register Section
const switchBtn = document.querySelector("#switchBtn");
switchBtn.addEventListener("click", (e)=> {
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
})

    //login and register button
const loginRegisterbtn = document.querySelector("#loginRegisterBtn");
loginRegisterbtn.addEventListener("click", (e)=> {
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
})
    //  Log in Section 
async function attemptLogin(username, password, access, loginKey) {
    if (!loginKey) {
        const userData = await fetchLogin(username, password, access);
        // loginUser(userData);
        console.log(userData);
    }
    if (loginKey) {
        const userData = await fetchLogin(username, password, access, loginKey);
        // loginUser(userData);
        console.log(userData);  
    }  
    
}
async function fetchLogin(username, password, access, loginKey) {
    const request = new Request (`/server/login.php`);
    const data = {
        headers: {"Content-type": "application/json"},
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

function checkIfAlreadyLoggedIn() {
    const key = localStorage.getItem("LogInKey");

    console.log(key);
    if (!key) { return };
    attemptLogin("", "", "Access-Key: Auth", key);
}

function renderLoginPage(params) {
}

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
    const request = new Request (`/server/register.php`);
    const data = {
    headers: {"Content-type": "application/json"},
    method: "POST",
    body: JSON.stringify({
        username: username,
        password: password,
        displayName: displayname,
        access: "Access-Register: Auth"
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
    
}
