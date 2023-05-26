"use strict";
let token = "";
let tokenTimer;
// Fetch spotify api token from server
async function fetchToken(params) {
    fetch("../Laulu/server/spotifyApi/tokenAccess.php")
        .then(r => r.json())
        .then(r => {
            token = r.token;
            tokenTimer = r.tokenTimeLeft;
            return token;
        })
};

// SEARCH SECTION
async function renderSearchView(e) {
    const allOverlaysOpen = document.querySelectorAll(".overlayReview");
    if (allOverlaysOpen.length > 0) {    allOverlaysOpen.forEach(overlay => overlay.remove() );    }
    clearSearch();
    const originButton = e.target.id
    // Get Spotify token
    token = await fetchToken();
    if (document.querySelector("#searchWindow")) { return };
    const contentContainer = document.querySelector("#contentContainer");
    const html = `
    <div id="resultsWindow">
    </div>
    <div id="searchWindow">
        <div id="searchContainer">
            <input type="text" id="searchField" placeholder="Find an album, artist or user" autocomplete="off">
            <img id="searchNavigator" src="../Laulu//media/icons/search.svg" alt="">
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
    document.querySelector("#css2").setAttribute("href", "../Laulu/css/search.css");

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
    const request = new Request(`../Laulu/server/searchUsers.php?search=${input}`);
    fetch(request)
        .then(r => r.json())
        .then(userResource => {
            clearSearchUsers();
            listUsers(userResource);
        })
}
// Display albums
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

async function displayAlbum(albumData) {
    const resultsWindow = document.querySelector("#resultsWindow");
    const artistName = albumData.artistName
    const albumName = albumData.albumName
    const albumCover = albumData.albumCover
    const albumId = albumData.albumId
    let html = `
        <button id="closeResultsButton"></button>
        <div id="albumInfo">
            <div id="artistInfo">
                <p id="albumName">${albumName}</p>
                <p id="artistName">${artistName}</p>
            </div>
            <img id="" src="${albumCover}" alt="">
        </div>
        <div id="averageRatingContainer">
            <p id="averageRating"></p>
            <p id="totalReviews"></p>
        </div>
        <button id="reviewButton">Review Album</button>
        <div>Reviews of this album</div>
        <ul id="reviewsContainer"></ul>
    `
    resultsWindow.innerHTML = html
    if (albumData.reviewDirectly) { renderCreateReviewView(albumData); return;}
    const averageRatingContainer = resultsWindow.querySelector("#averageRatingContainer");
    const averageRatingPDom = resultsWindow.querySelector("#averageRating");
    const totalReviewsPDom = resultsWindow.querySelector("#totalReviews");
    const reviewsUl = resultsWindow.querySelector("#reviewsContainer");
    const searchwWindow = document.querySelector("#searchWindow");

    const response = await fetch(`../Laulu/server/getReviews.php/?albumId=${albumId}`);
    const resource = await response.json();
    if (resource.reviews) {
        const averageRating = resource.averageRating;
        const totalReviews = resource.totalReviews;
        const reviews = resource.reviews;
        reviews.sort((a, b) => b.timestamp - a.timestamp);
        averageRatingPDom.textContent = `${averageRating}/5`;
        totalReviewsPDom.textContent = `Total reviews: ${totalReviews}`;
        if (reviews.length > 0) {
            reviews.forEach(review => {
                makeReview(review, "#reviewsContainer")
            });
        }
        document.querySelectorAll(`.review`).forEach(review => review.addEventListener("click", expandReview));
        
    } else {;
        reviewsUl.innerHTML = "<p>Unrated, be the first!<p>"
    }

    resultsWindow.dataset.albumId = albumId;
    resultsWindow.style.display = "flex";
    const closeButton = resultsWindow.querySelector("#closeResultsButton");
    const ReviewAlbumButton = resultsWindow.querySelector("#reviewButton");
    // Event listers
    // Closing the result window
    closeButton.addEventListener("click", () => { resultsWindow.style.display = "none"; searchwWindow.classList.remove("hidden") });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { resultsWindow.style.display = "none"; } })

    if (searchwWindow) {    searchwWindow.classList.add("hidden");  }
    const userData = await getUserData(localStorage.getItem("userId"));
    if (userData.albumData.boards.length > 0) {
        ReviewAlbumButton.addEventListener("click", () => {
            albumData.reviewDirectly = true;
            renderCreateReviewView(albumData);
        });
    } else {  ReviewAlbumButton.addEventListener("click", renderCreateReviewView)    }
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

                liDom.querySelector(`.searchProfilePicture`).style.backgroundImage = `url(../Laulu/media/defaultProfilePicture.png)`;
            } else {

                liDom.querySelector(`.searchProfilePicture`).style.backgroundImage = `url(../Laulu/media/usersMedia/${userId}/${userProfilePicture})`;
            }
            liDom.addEventListener("click", ()=>{ renderProfileView(userId); })
        });
    } else {
        userDomUl.innerHTML = "No users found";
    }
}

// Clear serach fields
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

function toggleSearchIcon(params) {
    const searchNavigator = document.querySelector("#searchNavigator");
    const input = document.querySelector("#searchField");
    if (!searchNavigator) { return };
    if (input.value === "") {
        searchNavigator.src = "../Laulu//media/icons/search.svg"
    } else {
        searchNavigator.src = "../Laulu//media/icons/close_0.png"
        searchNavigator.addEventListener("click", () => {
            searchNavigator.src = "../Laulu/media/icons/search.svg"
            input.value = "";
            clearSearch();
        })
    }
}