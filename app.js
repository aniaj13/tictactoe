const board = document.getElementById('board');
const squareA = document.getElementById('square_a')
const squareB = document.getElementById('square_b')
const squareC = document.getElementById('square_c')
const squareD = document.getElementById('square_d')
const squareE = document.getElementById('square_e')
const squareF = document.getElementById('square_f')
const squareG = document.getElementById('square_g')
const squareH = document.getElementById('square_h')
const squareI = document.getElementById('square_i')


const squares = document.getElementsByClassName('square');

let player1Turn = true;
for (let square of squares) {
   square.addEventListener('click', function () {
       if (player1Turn) {
           square.innerText = 'O';
           player1Turn = false;
       }
       else {
           square.innerText = 'X';
           player1Turn = true;
       }

    })
}

