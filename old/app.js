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

startBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (validateForm()) {
        resetGame();
        checkGameModeChoice()
        if (gameMode === 'player') {
            for (let square of squaresArr) {
                square.addEventListener('click', playWithPlayer)
            }
        } else if (gameMode === 'pc') {
            for (let square of squaresArr) {
                square.addEventListener('click', playWithPc);
            }
        }
        resetBtn.style.display = 'block';
    }
});

function validateForm() {
    if (!pcChoiceBtn.checked && !playerChoiceBtn.checked) {
        alert('Wybierz tryb gry')
        return false;
    }
    return true;
}

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

function checkGameModeChoice() {
    if (pcChoiceBtn.checked) {
        gameMode = 'pc';
    } else if (playerChoiceBtn.checked) {
        gameMode = 'player';
    }
}

function playWithPlayer() {
    if (playerOTurn) {
        playerTurnSign.innerText = 'X';
        this.innerText = 'O';
        playerOTurn = false;
    } else {
        playerTurnSign.innerText = 'O';
        this.innerText = 'X';
        playerOTurn = true;
    }
    this.removeEventListener('click', playWithPlayer);
    if (!checkWinner()) {
        checkTie();
    }
}

function playWithPc() {
    if (playerOTurn) {
        this.innerText = 'O';
        this.removeEventListener('click', playWithPc);
        playerOTurn = false;
        if (!checkWinner()) {
            if (!checkTie()) {
                playerTurnSign.innerText = 'X';
                setTimeout(() => {
                    pcMove();
                    playerOTurn = true;
                    if (!checkWinner()) {
                        checkTie()
                    }
                }, 800)
            }
        }
    }
}

function pcMove() {
    let pcTurn = true
    while (pcTurn) {
        let i = Math.floor(Math.random() * 9);
        for (let square of squaresArr) {
            if (checkIfEmpty(squaresArr[i])) {
                squaresArr[i].innerHTML = 'X';
                squaresArr[i].removeEventListener('click', playWithPc)
                pcTurn = false;
            }
        }
    }
    playerTurnSign.innerText = 'O';
}

function checkIfEmpty(square) {
    return (square.innerText !== 'X' && square.innerText !== 'O')
}

function isBoardFull() {
    for (let i = 0; i < squaresArr.length; i++) {
        if (checkIfEmpty(squaresArr[i])) {
            return false
        }
    }
    return true;
}

function removeSquareEvents() {
    for (let square of squaresArr) {
        square.removeEventListener('click', playWithPlayer)
        square.removeEventListener('click', playWithPc)
    }
}

function allSame(array) {
    const first = array[0].innerText;
    for (let i = 1; i < array.length; i++) {
        if (array[i].innerText === '') {
            return false;
        } else if (array[i].innerText !== first) {
            return false;
        }
    }
    return true;

}

function checkWinner() {
    for (let array of winningCombinations) {
        if (allSame(array)) {
            let winner = array[0].innerText;
            isGameOn = false;
            gameInfo.style.display = 'none';
            winnerInfo.style.display = 'block';
            winnerInfo.innerText = `Koniec Gry! Gracz "${winner}" wygrał!`;
            removeSquareEvents();
            return true;
        }
    }
    return false;
}

function checkTie() {
    if (isBoardFull()) {
        isGameOn = false;
        gameInfo.style.display = 'none'
        winnerInfo.style.display = 'block'
        winnerInfo.innerText = 'Remis!'
        removeSquareEvents();
        return true;
    }
    return false;
}

resetBtn.addEventListener('click', playAgain);

function playAgain() {
    if (validateForm()) {
        resetGame();
        if (gameMode === 'player') {
            for (let square of squaresArr) {
                square.addEventListener('click', playWithPlayer)
            }
        } else if (gameMode === 'pc') {
            for (let square of squaresArr) {
                square.addEventListener('click', playWithPc);
            }
        }
    }
}