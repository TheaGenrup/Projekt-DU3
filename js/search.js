"use strict";
let token = "";
let tokenTimer;

async function fetchToken(params) {
    fetch("/server/spotifyApi/tokenAccess.php")
        .then(r => r.json())
        .then(r => {
            token = r.token;
            tokenTimer = r.tokenTimeLeft;
            return token;
        })
};

function toggleSearchIcon(params) {
    const searchNavigator = document.querySelector("#searchNavigator");
    const input = document.querySelector("#searchField");
    if (!searchNavigator) { return };
    if (input.value === "") {
        searchNavigator.src = "/media/icons/Search.png"
    } else {
        searchNavigator.src = "/media/icons/close_0.png"
        searchNavigator.addEventListener("click", () => {
            searchNavigator.src = "/media/icons/Search.png"
            input.value = "";
            clearSearch();
        })
    }
}

// SEARCH SECTION
async function renderSearchView(e) {
    clearSearch();
    const originButton = e.target.id
    console.log(originButton);
    // Get Spotify token
    token = await fetchToken();
    if (document.querySelector("#searchWindow")) { return };
    const contentContainer = document.querySelector("#contentContainer");
    const html = `
    <div id="resultsWindow">
    </div>
    <div id="searchWindow">
        <div id="searchContainer">
            <input type="text" id="searchField" placeholder="Find a album, artist or user" autocomplete="off">
            <img id="searchNavigator" src="/media/icons/Search.png" alt="">
        </div>
        <ul id=userUl> </ul>
        <ul id=albumUl> </ul>
    </div>
    `;
    contentContainer.innerHTML = html;
    const searchField = contentContainer.querySelector("#searchField");
    searchField.addEventListener("keyup", searchAlbums);
    /* 
    Check if search is being done directly from add board or review section
        if the user is searching via the search icon then users will also be listed via the searchUsers function,
        They will also see a showcase of the album with information such as:
                * average rating
                * other reviews of the album
                * name of the artist and album
        
        if the user instead is searching from the add review section they will only be able to see albums when searching and will be directly directed to the review album section.
    */
    if (originButton === "searchIcon") { searchField.addEventListener("keyup", searchUsers); }
    // CSS change
    document.querySelector("#css2").setAttribute("href", "/css/search.css");

    searchField.style.width = "100%";

    // Search for albums functions
    function searchAlbums(e) {
        let input = e.target.value;
        toggleSearchIcon();
        if (!input) { clearSearch(); return }
        startLoadingScreen(document.querySelector("main"));
        let albumSearchEndpoint = `https://api.spotify.com/v1/search?q=${input}&type=album&offset=0&limit=10`;

        if (token.length > 0 || token != undefined) {
            fetch(albumSearchEndpoint, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
                .then(response => {
                    return response.json()
                })
                .then(albumResource => {
                    const albumsfetched = albumResource.albums.items;
                    const albumsFound = []
                    albumsfetched.forEach(album => {
                        let albumInfo = {
                            artist: album.artists[0].name,
                            albumName: album.name,
                            albumId: album.id,
                            albumCover: album.images[1].url,
                            albumType: album.album_type,
                        }
                        albumsFound.push(albumInfo);
                    });
                    clearSearchAlbums();
                    listAlbums(albumsFound);
                });

        }
    };
    // List albums function
    async function listAlbums(albumsFound) {
        const albumDomUl = document.querySelector("#albumUl");
        const userData = await getUserData(localStorage.getItem("userId"));
        const usersAlbumList = userData.albumData.favourites;


        if (albumsFound.length > 0) {
            albumsFound.forEach(album => {
                // albums constants
                const albumName = album.albumName;
                const artist = album.artist;
                const albumId = album.albumId;
                const albumCover = album.albumCover;

                const liDom = document.createElement("li");
                liDom.setAttribute("id", albumId)
                liDom.innerHTML =
                    `
                    <img class="albumPreviewImage" src="${albumCover}"></img>
                    <div class="albumListingInformation">
                        <p class="albumName">${albumName}</p>
                        <p class="artistName">${artist}</p>
                    </div>
                    <button class="saveButton"></button>
                `;
                const saveButton = liDom.querySelector("button");
                saveButton.addEventListener("click", (e) => { e.stopPropagation() });
                saveButton.addEventListener("click", (e) => { const results = addToListenList(album, saveButton) });
                usersAlbumList.forEach(listItem => {
                    if (listItem.albumId === albumId) {
                        saveButton.classList.remove("saveButton");
                        saveButton.classList.add("savedButton");
                    }
                });

                // If searching via the search icon from navigation, showCase other reviews first else directly render review album
                if (originButton === "searchIcon") { liDom.addEventListener("click", showCaseAlbum); }
                if (originButton === "createReview") {
                    liDom.dataset.reviewDirectly = "true";
                    liDom.addEventListener("click", showCaseAlbum);
                }
                // Add album to listen list

                albumDomUl.append(liDom);
            });
            stopLoadingScreen();
        } else {
            albumDomUl.innerHTML = "<li id='noResults'>No results found :(</li>";
            stopLoadingScreen();
        }
    };
};

function searchUsers(e) {
    let input = e.target.value;
    if (!input) { return }
    const request = new Request(`/server/searchUsers.php?search=${input}`);
    fetch(request)
        .then(r => r.json())
        .then(userResource => {
            clearSearchUsers();
            listUsers(userResource);
        })
}

function showCaseAlbum(e) {
    let liDom;
    if (e.target.tagName === "P") { liDom = e.target.parentElement.parentElement };
    if (e.target.tagName === "DIV") { liDom = e.target.parentElement };
    if (e.target.tagName === "IMG") { liDom = e.target.parentElement };
    if (e.target.tagName === "BUTTON") { return };
    if (e.target.tagName === "LI") { liDom = e.target };

    const artistName = liDom.querySelector(".artistName").textContent;
    const albumName = liDom.querySelector(".albumName").textContent;
    const albumCover = liDom.querySelector(".albumPreviewImage").src
    const albumId = liDom.id;

    const albumData = {
        artistName: artistName,
        albumName: albumName,
        albumCover: albumCover,
        albumId: albumId,

    };
    if (liDom.dataset.reviewDirectly) {
        albumData.reviewDirectly = true;
    }

    displayAlbum(albumData);
}
// List Users
function listUsers(usersFound) {
    const userDomUl = document.querySelector("#userUl");
    userDomUl.innerHTML = "";
    if (usersFound.length > 0) {
        usersFound.forEach(user => {
            const userDisplayName = user.displayName;
            const userId = user.id;
            const userProfilePicture = user.profilePicture;
            console.log(userId);



            const liDom = document.createElement("li");
            liDom.setAttribute("id", userId);
            liDom.innerHTML =
                `
                <div class="searchProfilePicture"></div>
                <div class="albumInformation">
                    <p>${userDisplayName}</p>
                </div>
            `;
            liDom.dataset.userId = userId;
            userDomUl.append(liDom);

            if (userProfilePicture === "" || userProfilePicture === undefined || userProfilePicture === null) {

                liDom.querySelector(`.searchProfilePicture`).style.backgroundImage = `url(/media/default.png)`;
            } else {

                liDom.querySelector(`.searchProfilePicture`).style.backgroundImage = `url(/media/usersMedia/${userId}/${userProfilePicture})`;
            }
            liDom.addEventListener("click", renderProfileView)
        });
    } else {
        userDomUl.innerHTML = "No users found";
    }
}

function clearSearch() {
    const albumDomUl = document.querySelector("#albumUl");
    const userDomUl = document.querySelector("#userUl");
    if (albumDomUl) { albumDomUl.innerHTML = ""; };
    if (userDomUl) { userDomUl.innerHTML = ""; };
}

function clearSearchAlbums() {
    const albumDomUl = document.querySelector("#albumUl");
    if (albumDomUl) { albumDomUl.innerHTML = ""; };
}

function clearSearchUsers() {
    const userDomUl = document.querySelector("#albumUl");
    if (userDomUl) { userDomUl.innerHTML = ""; };
}

/*
token.json information:
{
    "access_token": "BQAoCUDwy7YUnKgcDVi5cB9LmHM-ooJrjjFQIqiTwBwvVmcR_E912gr5ANoIKYGh-X64gdkgSYiw-Zs5w2CtqaK6LBFsxNCxTbTKN8bcVtOW5HopwoA5",
    "token_type": "Bearer",
    "expires_in": 3600,
    "timestamp": 1683221337
}
*/


/*

    function addReview() {
        const rating = document.querySelectorAll(".chosen").length
        const reviewDescription = document.querySelector("#reviewDescription").value
        const boardId = parseInt(document.querySelector("#selectBoard").dataset.boardId);
        const reviewObject = {
            rating: rating,
            reviewDescription: reviewDescription,
            boardId: boardId,
            artistName: artistName,
            albumName: albumName,
            albumCover: albumCover,
            albumId: albumId,
            userId: userId,
            review: "review"
        }
        addBoardOrReview(reviewObject);
        
    }


*/