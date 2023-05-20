"use strict";
let token = "";
let tokenTimer;

async function fetchToken(params) {
    fetch("/server/spotifyApi/tokenAccess.php")
    .then(r=>r.json())
    .then(r => {
        token = r.token;
        tokenTimer = r.tokenTimeLeft;
        return token;
})};

function toggleSearchIcon(params) {
    const searchNavigator = document.querySelector("#searchNavigator");
    const input = document.querySelector("#searchField");
    if (!searchNavigator) { return };
    if (input.value === "") {
        searchNavigator.src = "/media/icons/Search.png"
    } else {
        searchNavigator.src = "/media/icons/close_0.png"
        searchNavigator.addEventListener("click", ()=>{
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
    // Get Spotify token
    token = await fetchToken();
    if (document.querySelector("#searchWindow")) { return };
    const contentContainer = document.querySelector("#contentContainer");
    const html = `
    <div id="resultsWindow">
    </div>
    <div id="searchWindow">
        <div id="searchContainer">
            <input type="text" id="searchField" placeholder="Album, Artist, user" autocomplete="off">
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
    if (originButton === "searchIcon") { searchField.addEventListener("keyup", searchUsers);}
    // CSS change
    document.querySelector("#css2").setAttribute("href", "/css/search.css");

    searchField.style.width = "100%";

    // Search for albums functions
    function searchAlbums(e) {
        let input = e.target.value;
        toggleSearchIcon();
        if (!input) {  clearSearch();   return}
        startLoadingScreen(document.querySelector("main"));
        let albumSearchEndpoint = `https://api.spotify.com/v1/search?q=${input}&type=album&offset=0&limit=10`;
    
        if (token.length > 0 || token != undefined) { 
          fetch(albumSearchEndpoint, {
              headers: {
                  "Authorization": "Bearer " + token
              }
          })
          .then(response => {
            return response.json()})
          .then(albumResource => {
            const albumsfetched = albumResource.albums.items;
            const albumsFound = []
            albumsfetched.forEach(album => {
              const artistsInAlbum = []; 
              album.artists.forEach(artist => {
                artistsInAlbum.push(artist.name)
              });
              let albumInfo = {
                albumArtists: artistsInAlbum,
                albumName:  album.name,
                albumId:    album.id,
                albumImage: album.images[1].url,
                albumType:  album.album_type,
              }
              albumsFound.push(albumInfo);
            });
            clearSearchAlbums();
            listAlbums(albumsFound);
          });
    
        }
    };
    // List albums function
    function listAlbums(albumsFound) {
        const albumDomUl = document.querySelector("#albumUl");
        if (albumsFound.length > 0) {
            albumsFound.forEach(album => {
                // albums constants
                const albumName     = album.albumName;
                const albumArtists  = album.albumArtists;
                const albumId       = album.albumId;
                const albumImage    = album.albumImage;
        
                const liDom = document.createElement("li");
                liDom.setAttribute("id", albumId)
                liDom.innerHTML = 
                `
                    <img class="albumPreviewImage" src="${albumImage}"></img>
                    <div class="albumListingInformation">
                        <p class="albumName">${albumName}</p>
                        <p class="artistName">${albumArtists[0]}</p>
                    </div>
                `;
                if (albumDomUl.dataset.choosealbum) {
                    liDom.addEventListener("click", chooseAlbumToReview)
                }
                // If searching via the search icon from navigation, showCase other reviews first else directly render review album
                if (originButton === "searchIcon") { liDom.addEventListener("click", showCaseAlbum); }
                if (originButton === "createReview") {
                    liDom.dataset.reviewDirectly = "true";
                    liDom.addEventListener("click", showCaseAlbum); }
        
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
    if (!input) {return}
    const request = new Request(`/server/searchUsers.php?search=${input}`);
    fetch(request)
        .then(r=>r.json())
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
    if (e.target.tagName === "LI") { liDom = e.target };

    const artistName = liDom.querySelector(".artistName").textContent;
    const albumName = liDom.querySelector(".albumName").textContent;
    const albumCover = liDom.querySelector(".albumPreviewImage").src
    const albumId = liDom.id;

    const albumData = {
        artistName:artistName,
        albumName:albumName,
        albumCover:albumCover,
        albumId:albumId,
        
    };
    if (liDom.dataset.reviewDirectly) {
        albumData.reviewDirectly = true;
    }

    displayAlbum(albumData);
}
    // List Users
function listUsers(usersFound) {
    const UserDomul = document.querySelector("#userUl");
    UserDomul.innerHTML = "";
    if (usersFound.length > 0) {
        usersFound.forEach(user => {
            const UserDisplayName = user.displayName;
            const Userid = user.id;
            const UserprofilePicture = user.profilePicture;
    
    
    
            const liDom = document.createElement("li");
            liDom.setAttribute("id", Userid);
            liDom.innerHTML = 
            `
                <img src="${UserprofilePicture}"></img>
                <div class="albumInformation">
                    <p>${UserDisplayName}</p>
                </div>
            `;
    
            UserDomul.append(liDom)
        });
    } else {
        UserDomul.innerHTML = "No users found";
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