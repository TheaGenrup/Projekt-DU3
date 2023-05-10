"use strict";

async function createBoardOrReview() {
    // start loading
    const id = localStorage.getItem("id");
    const modal = document.querySelector("[data-modal]");
    const html = `
    <button id="closeModalBtn" data-close-modal><img src="./media/icons/close_0.png" alt=""></button>
    <h2>Create new:</h2>
    <div id="overlayContentContainer">
        <div id="chooseCreateTypeContainer"class="horizontalContainer">
            <button id="createBoardBtn" class="createBox">board</button>
            <button id="createReviewBtn" class="createBox">review</button>
        </div>
        <div id="createContainer" class="closed">


            <div id="createBoardContainer" class="closed">
                <label for="boardNameInput">Board Name</label>
                <input type="text" placeholder="Jazz.." id="boardNameInput">
                <button id="addBoardPhotoBtn">+</button>
            </div>


            <div id="createReviewContainer" class="closed">
                <div id="searchAlbumContainer">
                    <label for="searchAlumInput">Search Album or Artist</label>
                    <input type="text" placeholder="Pitbull..." id="searchAlbumInput">
                    <ul>
                    </ul>
                </div>
                <div id="rateAlbumContainer" class="closed">
                    <label for="">Album rating</label>
                    <div id="chooseRatingContainer">
                        <img src="./media/icons/empty_star.png" alt="">
                        <img src="./media/icons/empty_star.png" alt="">
                        <img src="./media/icons/empty_star.png" alt="">
                        <img src="./media/icons/empty_star.png" alt="">
                        <img src="./media/icons/empty_star.png" alt="">
                    </div>
                </div>
                <div class="closed">
                    <label for="">reviewDescription</label>
                    <textarea name="" id="reviewDescription" cols="30" rows="10"></textarea>
                </div>
            </div>


            <div class="horizontalContainer">
                <button id="cancelCreateBtn">Cancel</button>
                <button id="createBtn">Create</button>
            </div>
        </div>
    </div>
    `
    modal.innerHTML = html;
    const closeModalBtn = modal.querySelector("[data-close-modal]");
    closeModalBtn.addEventListener("click",()=>{modal.close()});
    const chooseCreateTypeContainer = modal.querySelector("#chooseCreateTypeContainer");
    const cancelCreateBtn = document.querySelector("#cancelCreateBtn");
    cancelCreateBtn.addEventListener("click", ()=>{
        chooseCreateTypeContainer.classList.remove("closed");
        chooseCreateTypeContainer.classList.add("open");
        createContainer.classList.add("closed");
        createContainer.classList.remove("open");
        createboardContainer.classList.add("closed");
        createboardContainer.classList.remove("open");
        createReviewContainer.classList.add("closed");
        createReviewContainer.classList.remove("open");
    })
    const createNewBoardBtn = modal.querySelector("#createBoardBtn");
    const createNewReviewBtn = modal.querySelector("#createReviewBtn");
    const createContainer = modal.querySelector("#createContainer");
    const createboardContainer = modal.querySelector("#createBoardContainer");
    const createReviewContainer = modal.querySelector("#createReviewContainer");
    const searchAlbumInput = modal.querySelector("#searchAlbumInput");
    searchAlbumInput.addEventListener("keyup", searchAlbums);
    createNewBoardBtn.addEventListener("click", showCreateNewBoard);
    createNewReviewBtn.addEventListener("click", showCreateNewReview);
    

    token = await fetchToken();
    // End loading
    modal.showModal();
    function showCreateNewReview() {
        chooseCreateTypeContainer.classList.add("closed");
        chooseCreateTypeContainer.classList.remove("open");
        createContainer.classList.remove("closed");
        createContainer.classList.add("open");
        createboardContainer.classList.add("closed");
        createboardContainer.classList.remove("open");
        createReviewContainer.classList.add("open");
        createReviewContainer.classList.remove("closed");
        
    }
    function showCreateNewBoard() {
        chooseCreateTypeContainer.classList.add("closed");
        chooseCreateTypeContainer.classList.remove("open");
        createContainer.classList.remove("closed");
        createContainer.classList.add("open");
        createboardContainer.classList.add("open");
        createboardContainer.classList.remove("closed");
        createReviewContainer.classList.add("closed");
        createReviewContainer.classList.remove("open");
        
    }
}
