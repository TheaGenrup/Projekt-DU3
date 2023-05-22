"use strict";

async function fetchReview(userId) {
    const response = await fetch(new Request(`../server/getReviews.php/?id=${userId}`));
    const reviews = await response.json();
    return reviews;
}