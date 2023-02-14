const board = document.getElementById('board');
const resetBtn = document.getElementById('resetBtn');
let playerTurnSign = document.getElementById('playerTurnSign');

const squares = document.getElementsByClassName('square');

let playerOTurn = true;
playerTurnSign.innerText = 'O';
for (let square of squares) {
   square.addEventListener('click', function () {
       if (playerOTurn) {
            playerTurnSign.innerText = 'X';
           square.innerText = 'O';
           playerOTurn = false;
       }
       else {
           playerTurnSign.innerText = 'O';
           square.innerText = 'X';
           playerOTurn = true;
       }})}

