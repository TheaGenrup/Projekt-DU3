"Use strict";
async function deleteReview(reviewId) {

    const requestDelete = new Request(`../server/deleteReview.php`, {
        method: "DELETE",
        body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            reviewId: reviewId
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    await fetch(requestDelete);
    // const resource = await response.json();


};