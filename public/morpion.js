// CLIENT-SIDE LOGIC

// All game variables ----------------------------------------------
let playerTiles = [];
let computerTiles = [];
let winner;
const gameBoard = document.getElementById("game-board");
const maxGridSpace = 64;
const allCells = document.querySelectorAll("td > div");
const playBtn = document.getElementById("play");
const restartBtn = document.getElementById("restart");
restartBtn.setAttribute("disabled", "true");

// Page Actions -----------------------------------------------------

// Enables interaction with board only when play button is clicked:
playBtn.addEventListener("click", (event) => {
  playBtn.setAttribute("disabled", "true");
  restartBtn.removeAttribute("disabled");
  restartBtn.addEventListener("click", Restart);
  allCells.forEach((cell) => {
    Reset(cell);
    cell.addEventListener("click", PlayerAction);
  });
});

// All functions ------------------------------------------------------

// Sets tile at corresponding location and memorises it:
function PlayerAction(event) {
  const target = event.explicitOriginalTarget;
  target.textContent = "o";
  target.setAttribute("class", "o");
  playerTiles.push(target);
  const x = target.parentNode;
  const y = x.parentNode;
  const position = {
    x: x.cellIndex,
    y: y.rowIndex,
  };
  VerifyBoard();
  //ComputerAction(position);
}

// Queries AI for next optimal move and sets tile accordingly:
function ComputerAction(playerPosition) {
  fetch("http://127.0.0.1:8080")
    .then((response) => {
      return response.json();
    })
    .then((data) => console.log(data));
  //VerifyBoard();
}

// Removes all events and reinitialises game board and variables:
function Restart() {
  playerTiles = [];
  computerTiles = [];
  allCells.forEach((cell) => {
    cell.removeEventListener("click", PlayerAction);
    Reset(cell);
  });
  restartBtn.setAttribute("disabled", "true");
  playBtn.removeAttribute("disabled");
}

// Checks if there are still empty slots and/or if there is a winner:
function VerifyBoard() {
  if (playerTiles.length + computerTiles.length === maxGridSpace || winner) {
    allCells.forEach((cell) => {
      cell.removeEventListener("click", PlayerAction);
    });
    if (winner) {
      console.log("We have a winner !");
      return 0;
    }
    console.log("Game over, no space left!");
    return 1;
  }
}

// Empties all slots on board:
function Reset(slot) {
  slot.removeAttribute("class");
  slot.textContent = "";
}
