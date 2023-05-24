"use strict";

// Add a new review or board function
async function addBoardOrReview(bodyData) {
    const uploadWrapper = document.querySelector("#uploadWrapper");
    startLoadingScreen(document.querySelector("main"));
    if (uploadWrapper.dataset.type === "review") {

        const request = new Request("/server/addBoardOrReview.php", {
            header: "Content-Type: application/json",
            method: "POST",
            body: JSON.stringify(bodyData),
        });
        const response = await fetch(request);
        const resource = await response.json();
        stopLoadingScreen();
        sendResponseMessage(resource.message, response.status);
    }


    if (uploadWrapper.dataset.type === "board") {
        const request = new Request("/server/addBoardOrReview.php", {
            header: "Content-Type: application/json",
            method: "POST",
            body: bodyData,
        });
        const response = await fetch(request);
        const resource = await response.json();
        stopLoadingScreen();
        sendResponseMessage(resource.message, response.status);
    }
}