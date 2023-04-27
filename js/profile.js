function create_boards(albumData) {

    const boards_data = albumData.boards;
    const board_of_boards = document.querySelector("#Board_of_boards");

    boards_data.forEach(board => {

        const board_div = document.createElement("div");
        const board_img = document.createElement("img");
        const board_p = document.createElement("p");

        board_of_boards.appendChild(board_div);
        board_div.appendChild(board_img);
        board_div.appendChild(board_p);

        board_img.setAttribute("src", board.thumbnail);
        board_p.textContent = board.boardName;
        board_div.classList = "board";


        // board_dom.addEventListener("click", show_choosen_board);

    });
}

