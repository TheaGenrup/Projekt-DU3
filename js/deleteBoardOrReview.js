"use strict";

async function deleteReview(event) {

    event.stopPropagation();

    //    const confirm = confirm("Are you sure you want to delete this review?\nEither OK or Cancel.");

    if (confirm("Are you sure you want to delete this review?\nEither OK or Cancel.")) {
        const loggedInUserId = localStorage.getItem("userId");
        const reviewId = event.target.dataset.reviewId;

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
        // const resource = await response.json();

        event.target.parentElement.remove();

    }



};