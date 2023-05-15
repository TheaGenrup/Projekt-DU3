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

                    // SEARCH SECTION
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
            albumArtists: artistsInAlbum,
            albumName:  album.name,
            albumId:    album.id,
            albumImage: album.images[2].url,
            albumType:  album.album_type,
          }
          albumsFound.push(albumInfo);
        });
        listAlbums(albumsFound);
        /*
        switch (list) {
            case "searchField":
                listAlbumsGeneralSearch(albumsFound);
                break;
            case "searchAlbumInput":
                listAlbumsForNewReview(albumsFound);
                break;
        }
        */
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
                    // List results
    // List Albums
function listAlbums(albumsFound) {
    const albumDomUl = document.querySelector("#albumUl");
    albumDomUl.innerHTML = "";
    if (albumsFound.length > 0) {
        albumsFound.forEach(album => {
            const albumName     = album.albumName;
            const albumArtists  = album.albumArtists;
            const albumId       = album.albumId;
            const albumImage    = album.albumImage;
            const albumType     = album.albumType;
    
            const liDom = document.createElement("li");
            liDom.setAttribute("id", albumId)
            liDom.innerHTML = 
            `
                <img src="${albumImage}"></img>
                <div class="albumInformation">
                    <p>${albumName}</p>
                    <p>${albumArtists[0]}</p>
                </div>
                <button class="saveButton"><img src="/media/icons/bookmark.png" alt=""></button>
            `;
    
            albumDomUl.append(liDom)
        });
    } else {
        albumDomUl.innerHTML = "No Albums found :(";
    }
}
    // List Users
function listUsers(usersFound) {
    const UserDomul = document.querySelector("#userUl");
    UserDomul.innerHTML = "";
    if (usersFound.length > 0) {
        usersFound.forEach(user => {
            console.log(user);
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
                <button class="saveButton"><img src="/media/icons/bookmark.png" alt=""></button>
            `;
    
            UserDomul.append(liDom)
        });
    } else {
        UserDomul.innerHTML = "No users found";
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


/*
token.json information:
{
    "access_token": "BQAoCUDwy7YUnKgcDVi5cB9LmHM-ooJrjjFQIqiTwBwvVmcR_E912gr5ANoIKYGh-X64gdkgSYiw-Zs5w2CtqaK6LBFsxNCxTbTKN8bcVtOW5HopwoA5",
    "token_type": "Bearer",
    "expires_in": 3600,
    "timestamp": 1683221337
}
*/