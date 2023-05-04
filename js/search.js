"use strict";
const openSearchWindowBtn = document.querySelector("#openSearchWindowBtn");
const closeSearchWindowBtn = document.querySelector("#closeSearchWindowBtn");
openSearchWindowBtn.addEventListener("click", openSearchWindow);
closeSearchWindowBtn.addEventListener("click", closeSearchWindow);
searchField.addEventListener("keyup", searchAlbums);
let token = "";
let tokenTimer;

function openSearchWindow() {
    const searchWindow = document.querySelector("#searchWindow");
    const searchFieldContainer = document.querySelector("#searchFieldContainer");
    const searchField = document.querySelector("#searchField");
    const closeSearchWindowBtn = document.querySelector("#closeSearchWindowBtn");

    closeSearchWindowBtn.style.display = "block";
    searchWindow.style.transition = "1s"
    searchWindow.style.height = "100%";
    searchFieldContainer.style.width = "100%";
    searchFieldContainer.style.height = "100%";
    searchField.style.display = "block";
    fetch("/server/spotifyApi/tokenAccess.php")
        .then(r=>r.json())
        .then(r => {
            token = r.token;
            tokenTimer = r.tokenTimeLeft;
})


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
}

function searchAlbums(e) {
    let input = e.target.value;
    if (input != "" || input === null || input === undefined) {
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
              name:       album.name,
              image:      album.images[1].url,
              albumId:    album.id,
              type:       album.album_type,
            }
            albumsFound.push(albumInfo)
          });
          console.log(albumsFound);
        });
  
      }
    }
}
