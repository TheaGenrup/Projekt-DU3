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

function openSearchWindow() {
    fetch("/server/spotifyApi/tokenAccess.php")
        .then(r=>r.json())
        .then(r => {
            token = r.token;
            tokenTimer = r.tokenTimeLeft;
    })
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
    searchWindow.style.height = "100%";
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
    let input = e.target.value;
    if (input === "" || input === null || input === undefined) {return}
    let albumSearchEndpoint = `https://api.spotify.com/v1/search?q=${input}&type=album&offset=0&limit=10`;

    if (token.length > 0 || token != undefined) { 
      fetch(albumSearchEndpoint, {
          headers: {
              "Authorization": "Bearer " + token
          }
      })
      .then(response => response.json())
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
            albumImage: album.images[1].url,
            albumType:  album.album_type,
          }
          albumsFound.push(albumInfo)
        });
        listAlbums(albumsFound);
      });

    }
}
function searchUsers(e) {
    let input = e.target.value;
    if (input === "" || input === null || input === undefined) {return}
    const request = new Request(`/server/searchUsers.php?search=${input}`);
    fetch(request)
        .then(r=>r.json())
        .then(userResource => {
            console.log(userResource);
        })
}

function listAlbums(albums) {
    const albumUl = document.querySelector("#albumUl");
    albumUl.innerHTML = "";
    if (albums.length > 0) {
        albums.forEach(album => {
            const artistName = album.artistName;
            const albumName = album.albumName;
            const albumId = album.albumId;
            const albumImage = album.albumImage;
            const albumType = album.albumType;
    
            const html = `
                <img class ="albumPreviewImage" src="${albumImage}" alt="${albumName}">
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
