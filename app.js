import {SquareId} from "./square_id_class.mjs";

const SINGLE_PLAYER_MODE = 1;
const MULTI_PLAYER_MODE = 2;
const SQUARE_ID_TEMPLATE = "square_{row}_{column}";
const FIRST_PLAYER_SYMBOL = 'O';
const SECOND_PLAYER_SYMBOL = 'X';

const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];
const boardView = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];
let nextPlayer;

// TODO: const mode = getChosenMode()
function getChosenMode() {
    if (document.getElementById('single_player_mode_option').checked) {
        return SINGLE_PLAYER_MODE
    } else if (document.getElementById('multi_player_mode_option').checked) {
        return MULTI_PLAYER_MODE
    }
}

document.getElementById("start_game_button")
    .addEventListener('click', event => {
        event.preventDefault();
        let mode = getChosenMode()
        try {
            initGame(mode);
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    });


function initGame(mode) {
    if (mode === SINGLE_PLAYER_MODE) {
        throw new Error(`Given mode SINGLE_PLAYER_MODE is not supported yet. Will be realeased in the next version`);
        // initSinglePlayerGame();
    } else if (mode === MULTI_PLAYER_MODE) {
        initMultiPlayerGame();
    } else {
        throw new Error(`Given mode ${mode} is not supported. Choose one of SINGLE_PLAYER_MODE and MULTI_PLAYER_MODE.`)
    }

}

function initMultiPlayerGame() {
    setupBoardView();
    nextPlayer = FIRST_PLAYER_SYMBOL;
}

function setupBoardView() {
    for (let row = 0; row < boardView.length; row++) {
        for (let column = 0; column < boardView.length; column++) {
            let squareId = SQUARE_ID_TEMPLATE.replace("{row}", row).replace("{column}", column);
            boardView[row][column] = document.getElementById(squareId);
            boardView[row][column].addEventListener('click', event => onSquareClick(event.target.id));
        }
    }
}

function onSquareClick(squareId) {
    makeMove(nextPlayer, new SquareId(squareId));
    updateBoardView(board);
}

function makeMove(playerSymbol, squareId) {
    // free square
    // player turn
    // game not over
    board[squareId.row][squareId.column] = playerSymbol;
    // check for winner
    switchNextPlayerTurn();
}

function switchNextPlayerTurn() {
    nextPlayer = nextPlayer === FIRST_PLAYER_SYMBOL ? SECOND_PLAYER_SYMBOL : FIRST_PLAYER_SYMBOL;
}

function updateBoardView(board) {
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board.length; column++) {
            boardView[row][column].innerText = board[row][column];
        }
    }
}
