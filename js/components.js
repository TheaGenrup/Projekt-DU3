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


function renderUserPage(userInfo) {


    const html = document.querySelector("body").innerHTML = `
    
    `

}