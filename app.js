const board = document.getElementById('board');
const resetBtn = document.getElementById('resetBtn');
const startBtn = document.getElementById('startBtn');
let playerTurnSign = document.getElementById('playerTurnSign');
let gameInfo = document.getElementById('gameInfo');
const squareA = document.getElementById('square_a');
const squareB = document.getElementById('square_b');
const squareC = document.getElementById('square_c');
const squareD = document.getElementById('square_d');
const squareE = document.getElementById('square_e');
const squareF = document.getElementById('square_f');
const squareG = document.getElementById('square_g');
const squareH = document.getElementById('square_h');
const squareI = document.getElementById('square_i');

const squares = document.getElementsByClassName('square');

const winningCombinations = [
    [squareA, squareD, squareG],
    [squareB, squareE, squareH],
    [squareC, squareF, squareI],
    [squareA, squareB, squareC],
    [squareD, squareE, squareF],
    [squareG, squareH, squareI],
    [squareA, squareE, squareI],
    [squareC, squareE, squareG],
];

let isGameOn = false;
let playerOTurn = false;
playerTurnSign.innerText = '';
startBtn.addEventListener('click', function(){
    isGameOn = true;
    playerOTurn = true;
    playerTurnSign.innerText = 'O';
    for (let square of squares) {
        if (isGameOn) {
            square.addEventListener('click', makeMove)
        } else {
            removeSquareEvents();
        }
    }
})

function makeMove() {
    if (playerOTurn === true) {
        playerTurnSign.innerText = 'X';
        this.innerText = 'O';
        playerOTurn = false;
    } else {
        playerTurnSign.innerText = 'O';
        this.innerText = 'X';
        playerOTurn = true;
    }
    this.removeEventListener('click', makeMove);
    checkWinner();
}

function removeSquareEvents() {
    for (let square of squares) {
        square.removeEventListener('click', makeMove)
    }
}

    function allSame(array) {
        const first = array[0].innerText;
        for (let i = 1; i < array.length; i++) {
            if (array[i].innerText === '') {
                return false;
            } else if (array[i].innerText !== first ) {
                return false;
            }
        } return true;
    }
function checkWinner(){
    for (let array of winningCombinations) {
        if (allSame(array) === true) {
            isGameOn = false;
            console.log('Game OVER');
            gameInfo.innerText = 'GAME OVER';
            removeSquareEvents();
        }
    }
}



