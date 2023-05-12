function fillStars(rating, reviewId) {

    let stars;

    if (reviewId == undefined) {
        // if the function is called in expandReview
        stars = document.querySelectorAll(`.stars > div`);
    } else {
        // if the function is called in renderDiscoverView
        stars = document.querySelectorAll(`#stars_${reviewId} > div`);
    }

    for (let i = 0; i < stars.length; i++) {

        const star = stars[i];
        if (i < rating) {
            star.style.backgroundImage = `url(../media/icons/filled_in_star.png)`;
        }
    }
}

async function getReviews(followingUserId) {

    const allReviews = [];

    const response = await fetch(new Request(`../server/getReviews.php/?id=${followingUserId}`));
    const reviews = await response.json();

    reviews.forEach(review => {
        allReviews.push(review);
    });

    return allReviews;
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
    return time;
}