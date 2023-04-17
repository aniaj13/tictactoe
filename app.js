import {SquareId} from "./square_id_class.js";

function generateBoard() {
    const htmlBoard = document.createElement('div');
    htmlBoard.setAttribute('id', 'board')
    for (let i = 0; i < 3; i++) {
        const boardRow = document.createElement('div')
        boardRow.classList.add('board_row')
        for (let j = 0; j < 3; j++) {
            const square = document.createElement('div');
            square.classList.add('square')
            square.setAttribute('id', `square_${i}_${j}`)
            boardRow.appendChild(square);
        }
        htmlBoard.appendChild(boardRow);
    }
    document.getElementById('boardPanel').appendChild(htmlBoard);
}

document.getElementById('game_info').style.display = 'none';
document.getElementById('boardPanel').style.display = 'none'
document.getElementById('reset_game_button').style.display = 'none'

document.getElementById('reset_game_button').addEventListener('click', restartGame)

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
let isPcMakingMove = false;
generateBoard();

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
    resetBoard(board);
    resetPageView();
    if (mode === SINGLE_PLAYER_MODE) {
        initSinglePlayerGame();
    } else if (mode === MULTI_PLAYER_MODE) {
        initMultiPlayerGame();
    } else if (mode === undefined) {
        return undefined;
    } else {
        throw new Error(`Given mode ${mode} is not supported. Choose one of SINGLE_PLAYER_MODE and MULTI_PLAYER_MODE.`)
    }
}

function initSinglePlayerGame() {
    setupBoardView();
    setupPageView();
    document.getElementById('board').addEventListener('click', event => onSinglePlayerSquareClick(event.target.id))
    nextPlayer = FIRST_PLAYER_SYMBOL;
    setPlayerTurnView(nextPlayer);
}

function onSinglePlayerSquareClick(squareId) {
    if (isPcMakingMove) {
        return
    }
    let clickedSquare = new SquareId(squareId)
    if (board[clickedSquare.row][clickedSquare.column]) {
        console.warn('Ignoring move, field already taken')
        return {result: IN_PROGRESS_GAME_RESULT};
    }
    let gameResult = makeMove(nextPlayer, clickedSquare);
    updateBoardView(board);
    if (gameResult.result === IN_PROGRESS_GAME_RESULT) {
        isPcMakingMove = true;
        setTimeout(() => {
            makePcMove(nextPlayer);
            isPcMakingMove = false;
        }, 500);
    } else if (gameResult.result === DRAW_GAME_RESULT) {
        endGame(DRAW_GAME_RESULT)
    } else if (gameResult.result === WIN_GAME_RESULT) {
        endGame(gameResult.winner);
    }
}

function makePcMove(playerSymbol) {
    let randSquareId = generateRandSquareId();
    while (board[randSquareId.row][randSquareId.column] !== null) {
        randSquareId = generateRandSquareId();
    }
    board[randSquareId.row][randSquareId.column] = playerSymbol;
    updateBoardView(board);
    let gameResult = calculateGameResult(board, playerSymbol);
    if (gameResult.result === IN_PROGRESS_GAME_RESULT) {
        switchNextPlayerTurn();
    } else if (gameResult.result === WIN_GAME_RESULT) {
        endGame(gameResult.winner)
    } else if (gameResult.result === DRAW_GAME_RESULT) {
        endGame(DRAW_GAME_RESULT);
    }
}

function generateRandSquareId() {
    let row = Math.floor(Math.random() * 3);
    let column = Math.floor(Math.random() * 3);
    return new SquareId(`square_${row}_${column}`);
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
            boardView[row][column].innerText = ''
        }
    }
}

function setPlayerTurnView(nextPlayer) {
    document.getElementById('player_turn_symbol').innerText = nextPlayer;
}

function setupPageView() {
    document.getElementById('game_info').style.display = 'flex';
    document.getElementById('boardPanel').style.display = 'flex'
    document.getElementById('reset_game_button').style.display = 'flex'
    document.getElementById('game_mode_panel').style.display = 'none'
}

function onSquareClick(squareId) {
    let gameResult = makeMove(nextPlayer, new SquareId(squareId));
    updateBoardView(board);
    console.log(gameResult)
    if (gameResult.result === IN_PROGRESS_GAME_RESULT) {
        console.log(`Next player: ${nextPlayer}`);
    } else if (gameResult.result === DRAW_GAME_RESULT) {
        endGame(DRAW_GAME_RESULT)
    } else if (gameResult.result === WIN_GAME_RESULT) {
        endGame(gameResult.winner);
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
    } else {
        board[squareId.row][squareId.column] = playerSymbol;
        let gameResult = calculateGameResult(board, playerSymbol);
        switchNextPlayerTurn();
        return gameResult;
    }
}

function calculateGameResult(board, currentPlayerSymbol) {
    if (hasPlayerWon(board, currentPlayerSymbol)) {
        return {result: WIN_GAME_RESULT, winner: currentPlayerSymbol}
    }
    if (isDraw(board)) {
        return {result: DRAW_GAME_RESULT}
    }
    return {result: IN_PROGRESS_GAME_RESULT}
}

function hasPlayerWon(board, currentPlayerSymbol) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === currentPlayerSymbol && board[i][1] === currentPlayerSymbol && board[i][2] === currentPlayerSymbol) {
            return true
        }
        if (board[0][i] === currentPlayerSymbol && board[1][i] === currentPlayerSymbol && board[2][i] === currentPlayerSymbol) {
            return true
        }
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

function isDraw(board) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === null) {
                return false;
            }
        }
    }
    return true;
}


function switchNextPlayerTurn() {
    nextPlayer = nextPlayer === FIRST_PLAYER_SYMBOL ? SECOND_PLAYER_SYMBOL : FIRST_PLAYER_SYMBOL;
    setPlayerTurnView(nextPlayer);
}

function updateBoardView(board) {
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board.length; column++) {
            boardView[row][column].innerText = board[row][column];
            styleSymbol(boardView[row][column]);
        }
        
    }
}

function styleSymbol(boardSquare) {
    if (boardSquare.innerText === 'O') {
        boardSquare.style.color = '#e0ce34'
    } else if (boardSquare.innerText === 'X') {
        boardSquare.style.color = '#0a62a2'
    }
}

function endGame(winner) {
    document.getElementById('boardPanel').replaceWith(document.getElementById('boardPanel').cloneNode(true));
    document.getElementById('game_mode_panel').style.display = 'flex'
    if (winner === DRAW_GAME_RESULT) {
        displayDrawResult();
    } else displayWinner(winner);
}


function displayWinner(winner) {
    document.getElementById('player_turn_info').style.display = 'none'
    document.getElementById('game_winner_info').style.display = 'flex';
    document.getElementById('game_winner_info').innerText = `Gracz ${winner} wygrał!`
}

function displayDrawResult() {
    document.getElementById('player_turn_info').style.display = 'none'
    document.getElementById('game_winner_info').style.display = 'flex';
    document.getElementById('game_winner_info').innerText = 'REMIS!'
}

function restartGame() {
    resetBoard(board)
    resetPageView();
    initGame(getChosenMode());
}

function resetBoard(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            board[i][j] = null;
        }
    }
    return board;
}

function resetPageView() {
    document.getElementById('player_turn_info').style.display = 'flex'
    document.getElementById('game_winner_info').style.display = 'none';
}
