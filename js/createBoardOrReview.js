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
                <div>
                    <label for="chooseBoardUl">Choose a board</label>
                    <select name="" id="chooseBoardUl">
                        <option value="test">test</option>
                    </select>
                </div>
                <div id="searchAlbumContainer">
                    <label for="searchAlumInput">Select an album to review</label>
                    <input type="text" placeholder="Pitbull..." id="searchAlbumInput">
                    <ul id="selectAlbumSearchUl" class="closed">
                    </ul>
                </div>
                <div id="selectedAlbumContainer">
                    <p>Selected Album:
                    <span id="selectedArtistName"></span>
                    <span id="selectedAlbumName"></span></p>
                    <img id="selectedAlbumImage" src=""></img>
                </div>
                <div id="rateAlbumContainer" class="open">
                    <label for="">Album rating</label>
                    <div id="chooseRatingContainer">
                        <div data-rating="1"></div>
                        <div data-rating="2"></div>
                        <div data-rating="3"></div>
                        <div data-rating="4"></div>
                        <div data-rating="5"></div>
                    </div>
                </div>
                <div class="open">
                    <label for="">reviewDescription</label>
                    <textarea name="" id="reviewDescription" cols="30" rows="10"></textarea>
                </div>
            </div>


            <div class="horizontalContainer">
                <button id="cancelCreateBtn">Cancel</button>
                <button id="createBtn" class="disabled">Create</button>
            </div>
        </div>
    </div>
    `
    modal.innerHTML = html;
    const closeModalBtn = modal.querySelector("[data-close-modal]");
    closeModalBtn.addEventListener("click",()=>{modal.close()});
    const chooseCreateTypeContainer = modal.querySelector("#chooseCreateTypeContainer");
    const cancelCreateBtn = document.querySelector("#cancelCreateBtn");

    const createNewBoardBtn = modal.querySelector("#createBoardBtn");
    const createNewReviewBtn = modal.querySelector("#createReviewBtn");
    const createContainer = modal.querySelector("#createContainer");
    const createboardContainer = modal.querySelector("#createBoardContainer");
    const createReviewContainer = modal.querySelector("#createReviewContainer");
    const searchAlbumInput = modal.querySelector("#searchAlbumInput");
    const starRatings = modal.querySelectorAll("#chooseRatingContainer div");
    const chooseBoardUl = modal.querySelector("#chooseBoardUl");
    

    const test = document.createElement("option");
    test.value = "test1"
    test.textContent = "test1"
    chooseBoardUl.append(test);

    const response = await fetch("")
    cancelCreateBtn.addEventListener("click", ()=>{
        chooseCreateTypeContainer.classList.remove("closed");
        chooseCreateTypeContainer.classList.add("open");
        createContainer.classList.add("closed");
        createContainer.classList.remove("open");
        createboardContainer.classList.add("closed");
        createboardContainer.classList.remove("open");
        createReviewContainer.classList.add("closed");
        createReviewContainer.classList.remove("open");
        
    });


    starRatings.forEach(star => {
        star.addEventListener("click", chooseRating)
        star.addEventListener("mouseover", starHoverEffect)
    });
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
    function starHoverEffect(e) {
        const index = parseInt(e.target.dataset.rating);
        const starRatings = e.target.parentElement.querySelectorAll("div");
        starRatings.forEach(star => {
            star.style.backgroundImage = "url(/media/icons/star-regular.svg)";
        });
        for (let i = 0; i < index; i++) {
            starRatings[i].style.backgroundImage = "url(/media/icons/star-solid.svg)";
            
        }
    
    }
    function chooseRating(e) {
        const rating = parseInt(e.target.dataset.rating);
        console.log(rating);
    }
}



