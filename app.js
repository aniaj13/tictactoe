const resetBtn = document.getElementById('resetBtn');
const startBtn = document.getElementById('startBtn');
const squareA = document.getElementById('square_a');
const squareB = document.getElementById('square_b');
const squareC = document.getElementById('square_c');
const squareD = document.getElementById('square_d');
const squareE = document.getElementById('square_e');
const squareF = document.getElementById('square_f');
const squareG = document.getElementById('square_g');
const squareH = document.getElementById('square_h');
const squareI = document.getElementById('square_i');
let playerTurnSign = document.getElementById('playerTurnSign');
let winnerInfo = document.getElementById('winnerInfo');
let gameInfo = document.getElementById('gameInfo');
const pcChoiceBtn = document.getElementById('pcPlayer')
const playerChoiceBtn = document.getElementById('otherPlayer')

const squares = document.getElementsByClassName('square');
const squaresArr = Array.from(squares);

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
gameInfo.style.display = 'none';
resetBtn.style.display = 'none'
let gameMode = null;


function resetGame() {
    winnerInfo.style.display = 'none';
    gameInfo.style.display = 'block';
    isGameOn = true;
    playerOTurn = true;
    playerTurnSign.innerText = 'O';
    for (let square of squaresArr) {
        square.innerText = '';
    }
}

resetBtn.addEventListener('click', playAgain);

function playAgain() {
    if (validateForm()) {
    resetGame();
    if (gameMode === 'player') {
        for (let square of squaresArr) {
            square.addEventListener('click', makeMove)
        }
    } else if (gameMode === 'pc') {
        for (let square of squaresArr) {
            square.addEventListener('click', playWithPc);
    }
}}}
startBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (validateForm()) {
        resetGame();
        checkGameModeChoice()
        if (gameMode === 'player') {
            for (let square of squaresArr) {
                square.addEventListener('click', makeMove)
                }}
        else if (gameMode === 'pc') {
                for (let square of squaresArr) {
                    square.addEventListener('click', playWithPc);
                }}
    resetBtn.style.display = 'block';
    }
});

function playWithPc() {
    if (playerOTurn === true) {
        playerTurnSign.innerText = 'O';
        this.innerText = 'O';
        playerOTurn = false;
        let win = checkWinner();
        if (!win) {
            checkTie();
            if (checkTie) {
                pcMove();
            }
        }
        playerOTurn = true;
    }
    this.removeEventListener('click', playWithPc)
    let win = checkWinner();
    if (!win) {
        checkTie();
    }
}

function pcMove() {
        let pcTurn = true
        while (pcTurn) {
            let i = createRandNum();
            for (let square of squaresArr) {
                if (checkEmpty(squaresArr[i])) {
                    squaresArr[i].innerHTML = 'X';
                    squaresArr[i].removeEventListener('click', playWithPc)
                    pcTurn = false;
                } else if (isBoardFull()) {
                    pcTurn = false;
                }
            }}}

function checkEmpty(square) {
    return (square.innerText !== 'X' && square.innerText !== 'O')
}

function isBoardFull() {
    for (let i = 0; i < squaresArr.length; i++) {
         if (checkEmpty(squaresArr[i])) {
             return false
         }
    } return true;
}

function createRandNum() {
    return Math.floor(Math.random() * 9);
}

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
    let win = checkWinner();
    if (!win){
        checkTie();
    }
}

function removeSquareEvents() {
    for (let square of squaresArr) {
        square.removeEventListener('click', makeMove)
        square.removeEventListener('click', playWithPc)
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
            let winner = whoWon(array);
            isGameOn = false;
            console.log('GAME OVER');
            console.log(`Player ${winner} Won!`)
            gameInfo.style.display = 'none';
            winnerInfo.style.display = 'block';
            winnerInfo.innerText = `Koniec Gry! Gracz "${winner}" wygrał!`;
            removeSquareEvents();
            return true;
        }
    } return false;
}


function whoWon(array) {
    let first = array[0].innerText;
    for (let i = 1; i < array.length; i++) {
        if (array[i].innerText === '') {
            return false;
        } else if (array[i].innerText !== first) {
            return false;
        }
    }
    return first;
}

function checkTie() {
    for (let square of squaresArr) {
            if (square.innerText === '') {
                return false;
            }
    }   isGameOn = false;
        console.log('Its a tie!')
        gameInfo.style.display = 'none'
        winnerInfo.style.display = 'block'
        winnerInfo.innerText = 'Remis!'
        removeSquareEvents();
}


function validateForm() {
    if (!pcChoiceBtn.checked && !playerChoiceBtn.checked) {
        alert('Wybierz tryb gry')
        return false;}
    return true;
}
function checkGameModeChoice() {
    if (pcChoiceBtn.checked) {
        gameMode = 'pc';
    } else if (playerChoiceBtn.checked) {
        gameMode = 'player';
    }
}
