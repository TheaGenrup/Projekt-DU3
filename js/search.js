"use strict";
/*
const openSearchWindowBtn = document.querySelector("#openSearchWindowBtn");
const closeSearchWindowBtn = document.querySelector("#closeSearchWindowBtn");
openSearchWindowBtn.addEventListener("click", openSearchWindow);
closeSearchWindowBtn.addEventListener("click", closeSearchWindow);
searchField.addEventListener("keyup", searchAlbums);
*/
let token = "";
let tokenTimer;

async function fetchToken(params) {
    fetch("/server/spotifyApi/tokenAccess.php")
    .then(r=>r.json())
    .then(r => {
        token = r.token;
        tokenTimer = r.tokenTimeLeft;
        return token;
})
}

async function openSearchWindow() {

    token = await fetchToken();
    /*
    fetch("/server/spotifyApi/tokenAccess.php")
        .then(r=>r.json())
        .then(r => {
            token = r.token;
            tokenTimer = r.tokenTimeLeft;
    })
    */
    const searchWindow = document.querySelector("#searchWindow");
    searchWindow.classList.add("open");
    const searchFieldContainer = document.querySelector("#searchFieldContainer");
    const searchField = document.querySelector("#searchField");
    const closeSearchWindowBtn = document.querySelector("#closeSearchWindowBtn");

    window.addEventListener("keyup", (e)=>{
        if (e.key === "Escape" && searchWindow.classList.contains("open")) {closeSearchWindow();}
    })
    searchWindow.style.transition = "1.5s"
    closeSearchWindowBtn.style.display = "block";
    searchWindow.style.display = "block";
    searchWindow.style.height = "92%";
    searchFieldContainer.style.width = "100%";
    searchFieldContainer.style.height = "100%";
    searchField.style.display = "block";
}

function closeSearchWindow() {
    const searchWindow = document.querySelector("#searchWindow");
    const searchFieldContainer = document.querySelector("#searchFieldContainer");
    const searchField = document.querySelector("#searchField");
    const closeSearchWindowBtn = document.querySelector("#closeSearchWindowBtn");
    
    closeSearchWindowBtn.style.display = "none";
    searchWindow.style.transition = "0s"
    searchWindow.style.height = "0%";
    searchFieldContainer.style.width = "0%";
    searchFieldContainer.style.height = "0%";
    searchField.style.display = "none";
    // Kanske ta bort? Ska vi rensa lista efter man stängt ner den?
    const albumUl = document.querySelector("#albumUl");
    albumUl.innerHTML = "";
}

function searchAlbums(e) {
    const list = e.target.id;
    let input = e.target.value;
    if (!input) {return}
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
            artistName: artistsInAlbum,
            albumName:  album.name,
            albumId:    album.id,
            albumImage: album.images[2].url,
            albumType:  album.album_type,
          }
          albumsFound.push(albumInfo);
        });
        switch (list) {
            case "searchField":
                listAlbumsGeneralSearch(albumsFound);
                break;
            case "searchAlbumInput":
                listAlbumsForNewReview(albumsFound);
                break;
        }
      });

    }
}

function listAlbumsForNewReview(albums) {
    const albumUl = document.querySelector("#selectAlbumSearchUl");
    albumUl.classList.remove("closed");
    albumUl.innerHTML = "";
    if (albums.length === 0) {
        const message = document.createElement("li");
        message.classList.add("message")
        message.textContent = "no albums found";
        albumUl.append(message);
    }
    if (albums.length > 0) {
        albums.forEach(album => {
            const artistName = album.artistName;
            const albumName = album.albumName;
            const albumId = album.albumId;
            const albumImage = album.albumImage;
            const albumType = album.albumType;
    
            const html = `
                <img class ="previewImage" src="${albumImage}" alt="${albumName}">
                <p class="artistName">${artistName}</p>
                <p class="albumName">${albumName}</p>
            `;
            const liDom = document.createElement("li");
            liDom.setAttribute("id", albumId);
            liDom.classList.add("albumPreview");
            liDom.innerHTML = html;

            liDom.addEventListener("click", chooseAlbumToReview)
            albumUl.append(liDom);
        });
    }
}

function chooseAlbumToReview(e) {
    let liDom;
    if (!e.target.id) { liDom = e.target.parentElement; } else { liDom = e.target; }
    const artistName = liDom.querySelector(".artistName").textContent;
    const albumName = liDom.querySelector(".albumName").textContent;
    const albumImage = liDom.querySelector("img").src
    const albumId = liDom.id;

    const selectedAlbumContainer = document.querySelector("#selectedAlbumContainer");
    const ArtistNameDom = selectedAlbumContainer.querySelector("#selectedArtistName");
    const AlbumNameDom = selectedAlbumContainer.querySelector("#selectedAlbumName");
    const AlbumImageDom = selectedAlbumContainer.querySelector("#selectedAlbumImage");
    const createReviewBtn = document.querySelector("#createBtn");


    selectedAlbumContainer.dataset.id = albumId;
    ArtistNameDom.textContent = artistName;
    AlbumNameDom.textContent = albumName;
    AlbumImageDom.src = albumImage;

    const albumUl = document.querySelector("#selectAlbumSearchUl");
    albumUl.classList.add("closed");
    createReviewBtn.classList.remove("disabled");
}

function listAlbumsGeneralSearch(albums) {
    const albumUl = document.querySelector("#albumUl");
    albumUl.innerHTML = "";
    const message = document.createElement("div");
    message.classList.add("message")
    message.textContent = "no albums found";
    albumUl.append(message);
    if (albums.length > 0) {
        message.textContent = "albums";
        albumUl.append(message);
        albums.forEach(album => {
            const artistName = album.artistName;
            const albumName = album.albumName;
            const albumId = album.albumId;
            const albumImage = album.albumImage;
            const albumType = album.albumType;
    
            const html = `
                <img class ="previewImage" src="${albumImage}" alt="${albumName}">
                <div class="albumInfo">
                    <p>${artistName}</p>
                    <p>${albumName}</p>
                    <p>${albumType}</p>
                </div>
                <img class="saveToListBtn" src="./media/icons/Add.png" alt="Press to save album">
            `;
            const liDom = document.createElement("li");
            liDom.setAttribute("id", albumId);
            liDom.classList.add("albumPreview");
            liDom.innerHTML = html;
            albumUl.append(liDom);
        });
    }
}
function searchUsers(e) {
    let input = e.target.value;
    if (!input) {return}
    const request = new Request(`/server/searchUsers.php?search=${input}`);
    fetch(request)
        .then(r=>r.json())
        .then(userResource => {
            console.log(userResource);
            listUsers(userResource);
        })
}

function listUsers(users) {
    const usersUl = document.querySelector("#usersUl");
    usersUl.innerHTML = "";
    usersUl.innerHTML = "";
    const message = document.createElement("div");
    message.classList.add("message")
    message.textContent = "no users found";
    if (users.length > 0) {
        message.textContent = "users";
        usersUl.append(message);
        users.forEach(user => {
            const displayName = user.displayName;
            const id = user.id;
            const profilePicture = user.profilePicture;

            const html = `
            <img src="${profilePicture}"></img>
            <div>${displayName}</div>
            `;

            const liDom = document.createElement("li");
            liDom.setAttribute("id", id);
            liDom.innerHTML = html;
            usersUl.append(liDom);
        });
    }
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