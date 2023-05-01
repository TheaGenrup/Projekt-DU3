
function loginUser(userData, followingNewReviews) {
    // jag behöver ha med åtminstone reviews också för alla users som den inloggade följer som argument till loginUser för de måste också skickas med i anropet till renderDiscoverView

    localStorage.setItem("logInKey", userData.loginKey);

    renderLoggedInView({
        profilePic: userData.profilePic,
    })

    // sortera reviews efter datum och tid

    renderDiscoverView(followingNewReviews);

}

// temporary call to function
loginUser({
    loginKey: "HkoZ87CbKB8dw6X990CT5hPye",
    profilePic: "../media/profile_picture.jpg",
},
    [
        {
            displayName: "Filip",
            date: "23-02-13",
            timestamp: "18:23",
            albumName: "Dreams",
            artist: "Fleetwood Mac",
            albumId: "5Bz2LxOp0wz7ov0T9WiRmc",
            reviewDescription: "I like when the music is making noise",
            rating: 4,
            reviewId: 34,
            albumCover: `url(../media/dreams.jpg)`,
        },
        {
            displayName: "Elin",
            date: "23-02-14",
            timestamp: "16:25",
            albumName: "Och stora havet",
            artist: "Jakob Hellman",
            albumId: "???",
            reviewDescription: "Woah! I've never cried like this before, except maybe when I saw the whale in theaters and I sat there bawling for like 2\/3 hours? Yeah great feeling.",
            rating: 5,
            reviewId: 31,
            albumCover: `url(../media/hellman.jpg)`,
        },
        {
            displayName: "Thea",
            date: "23-02-15",
            timestamp: "12:45",
            albumName: "Abbey Road",
            artist: "The Beatles",
            albumId: "???",
            reviewDescription: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem quod cum dolorum vel libero repellendus tempora, suscipit nam qui aliquid.",
            rating: 3,
            reviewId: 32,
            albumCover: `url(../media/beatles.jpg)`,
        },
        {
            displayName: "Thea",
            date: "23-02-17",
            timestamp: "17:54",
            albumName: "Och stora havet",
            artist: "Jakob Hellman",
            albumId: "???",
            reviewDescription: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem quod cum dolorum vel libero repellendus tempora, suscipit nam qui aliquid.",
            rating: 4,
            reviewId: 43,
            albumCover: `url(../media/beatles.jpg)`,
        }
    ]);