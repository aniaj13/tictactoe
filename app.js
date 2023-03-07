import {SquareId} from "./square_id_class.js";

document.getElementById('game_info').style.display = 'none';
document.getElementById('board').style.display = 'none'
document.getElementById('reset_game_button').style.display = 'none'

const SINGLE_PLAYER_MODE = 1;
const MULTI_PLAYER_MODE = 2;
const SQUARE_ID_TEMPLATE = "square_{row}_{column}";
const FIRST_PLAYER_SYMBOL = 'O';
const SECOND_PLAYER_SYMBOL = 'X';

const WIN_GAME_RESULT = 'WIN';
const DRAW_GAME_RESULT = 'DRAW';
const IN_PROGRESS_GAME_RESULT = 'IN_PROGRESS';

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
////////////////////////////////////////////////////////////////////////////
let actual;
let expected;
actual = calculateGameResult([
    [null, null, null],
    [null, null, null],
    [null, null, null]
], 'X');
expected = "IN_PROGRESS"
console.log("expected = " + expected + " actual = " + JSON.stringify(actual));

actual = calculateGameResult([
    ['X', null, 'X'],
    ['O', 'O', null],
    ['O', null, 'X']
], 'X');
expected = "IN_PROGRESS"
console.log("expected = " + expected + " actual = " + JSON.stringify(actual));

actual = calculateGameResult([
    ['X', null, 'X'],
    ['O', 'O', 'O'],
    ['O', null, 'X']
], 'O');
expected = "WIN_O"
console.log("expected = " + expected + " actual = " + JSON.stringify(actual));

actual = calculateGameResult([
    ['X', null, 'X'],
    ['O', 'O', 'X'],
    ['O', null, 'X']
], 'X');
expected = "WIN_X"
console.log("expected = " + expected + " actual = " + JSON.stringify(actual));
actual = calculateGameResult([
    ['X', 'X', 'O'],
    [null, 'O', null],
    ['O', null, null]
], 'O');
expected = "WIN_O"
console.log("expected = " + expected + " actual = " + JSON.stringify(actual));
actual = calculateGameResult([
    ['X', 'X', 'O'],
    ['O', 'X', null],
    ['O', 'O', 'X']
], 'X');
expected = "WIN_X"
console.log("expected = " + expected + " actual = " + JSON.stringify(actual));
////////////////////////////////////////////////////////////////////////////


document.getElementById("start_game_button")
    .addEventListener('click', event => {
        event.preventDefault();
        try {
            initGame(getChosenMode());
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    });

function getChosenMode() {
    if (document.getElementById('single_player_mode_option').checked) {
        return SINGLE_PLAYER_MODE
    }
    if (document.getElementById('multi_player_mode_option').checked) {
        return MULTI_PLAYER_MODE
    }
    if (!document.getElementById('single_player_mode_option').checked && !document.getElementById('multi_player_mode_option').checked) {
        alert('Choose a game mode to start the game.')
        return undefined
    }
    throw Error("Should not happen. Only single_player_mode_option and multi_player_mode_option radio buttons are available.");
}

function initGame(mode) {
    if (mode === SINGLE_PLAYER_MODE) {
        throw new Error(`Given mode SINGLE_PLAYER_MODE is not supported yet. Will be realeased in the next version`);
        // initSinglePlayerGame();
    } else if (mode === MULTI_PLAYER_MODE) {
        initMultiPlayerGame();
    } else if (mode === undefined) {
        return;
    } else {
        throw new Error(`Given mode ${mode} is not supported. Choose one of SINGLE_PLAYER_MODE and MULTI_PLAYER_MODE.`)
    }
}

function initMultiPlayerGame() {
    setupBoardView();
    setupPageView();
    document.getElementById('board').addEventListener('click', event => onSquareClick(event.target.id))
    nextPlayer = FIRST_PLAYER_SYMBOL;
    setPlayerTurnView(nextPlayer);
}


function setupBoardView() {
    for (let row = 0; row < boardView.length; row++) {
        for (let column = 0; column < boardView.length; column++) {
            let squareId = SQUARE_ID_TEMPLATE.replace("{row}", row).replace("{column}", column);
            boardView[row][column] = document.getElementById(squareId);
        }
    }
}

function setPlayerTurnView(nextPlayer) {
    document.getElementById('player_turn_symbol').innerText = nextPlayer;
}

function setupPageView() {
    document.getElementById('game_info').style.display = 'block';
    document.getElementById('board').style.display = 'block'
    document.getElementById('reset_game_button').style.display = 'block'
    document.getElementById('game_mode_panel').style.display = 'none'
}

function onSquareClick(squareId) {
    console.log(`squareId = ${squareId}`)
    let gameResult = makeMove(nextPlayer, new SquareId(squareId));
    updateBoardView(board);
    if (gameResult.result === IN_PROGRESS_GAME_RESULT) {
        console.log(`Next player: ${nextPlayer}`);
    } else if (gameResult.result === DRAW_GAME_RESULT) {
        console.log(`Draw`);
        // TODO: handle DRAW
    } else if (gameResult.result === WIN_GAME_RESULT) {
        console.log(`Player ${gameResult.winner} has won`);
        // TODO: handle WIN
    }
}

function makeMove(playerSymbol, squareId) {
    if (board[squareId.row][squareId.column]) {
        console.warn('Ignoring move, field already taken')
        return {result: IN_PROGRESS_GAME_RESULT};
    }
    if (nextPlayer !== playerSymbol) {
        console.warn(`Ignoring move, not player ${playerSymbol} turn.`)
        return {result: IN_PROGRESS_GAME_RESULT};
    }
    // game not over
    board[squareId.row][squareId.column] = playerSymbol;
    let gameResult = calculateGameResult(board);
    switchNextPlayerTurn();
    return gameResult;
}

function calculateGameResult(board, currentPlayerSymbol) {
    if (hasPlayerWon(board, currentPlayerSymbol)) {
        return {result: WIN_GAME_RESULT, winner: currentPlayerSymbol}
    }
    if (isDraw()) {
        return {result: DRAW_GAME_RESULT}
    }
    return {result: IN_PROGRESS_GAME_RESULT}
}

function hasPlayerWon(board, currentPlayerSymbol) {
    // check horizontally
    if (board[1][0] === currentPlayerSymbol && board[1][1] === currentPlayerSymbol && board[1][2] === currentPlayerSymbol) {
        return true;
    }
    // check vertically
    if (board[0][2] === currentPlayerSymbol && board[1][2] === currentPlayerSymbol && board[2][2] === currentPlayerSymbol) {
        return true;
    }
    // check diagonally - left
    if (board[0][2] === currentPlayerSymbol && board[1][1] === currentPlayerSymbol && board[2][0] === currentPlayerSymbol) {
        return true;
    }
    // check diagonally - right
    if (board[0][0] === currentPlayerSymbol && board[1][1] === currentPlayerSymbol && board[2][2] === currentPlayerSymbol) {
        return true;
    }
    return false;
}

function isDraw() {
    return false;
}

function switchNextPlayerTurn() {
    nextPlayer = nextPlayer === FIRST_PLAYER_SYMBOL ? SECOND_PLAYER_SYMBOL : FIRST_PLAYER_SYMBOL;
    setPlayerTurnView(nextPlayer);
}

function updateBoardView(board) {
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board.length; column++) {
            boardView[row][column].innerText = board[row][column];
        }
    }
}
