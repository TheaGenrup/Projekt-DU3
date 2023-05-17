async function deleteReview(event) {

    event.stopPropagation();

    const loggedInUserId = localStorage.getItem("userId");
    console.log(loggedInUserId);
    const reviewId = event.target.dataset.reviewId;
    console.log(reviewId);

    const bodyDelete = {
        userId: loggedInUserId,
        reviewId: reviewId
    };

    const requestDelete = new Request(`../server/deleteReview.php`, {
        method: "DELETE",
        body: JSON.stringify(bodyDelete),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    const response = await fetch(requestDelete);
    const resource = await response.json();


};