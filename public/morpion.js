// CLIENT-SIDE LOGIC

// All game variables ----------------------------------------------
let playerTiles = [];
let computerTiles = [];
let winner;
let x1 = -1;
let x2 = -1;
let y1 = -1;
let y2 = -1;
let player1 = false;
let player2 = false;
let turn = true;
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
  const target = event.target;
  if (turn) {
    target.textContent = "o";
    target.setAttribute("class", "o");
    playerTiles.push(target);
    x1 = target.parentNode;
    y1 = x1.parentNode;
    player1 = true;
    VerifyBoard();
  } else {
    target.textContent = "x";
    target.setAttribute("class", "x");
    computerTiles.push(target);
    x2 = target.parentNode;
    y2 = x2.parentNode;
    player2 = true;
    VerifyBoard();
  }
  turn = !turn;

  if (player1 && player2) {
    const positions = {
      player1: {
        x: x1.cellIndex,
        y: y1.rowIndex,
      },
      player2: {
        x: x2.cellIndex,
        y: y2.rowIndex,
      },
    };
    ComputeAction(positions);
  }
}

// Queries AI for next optimal move and sets tile accordingly:
async function ComputeAction(playerPosition) {
  console.log(playerPosition);
  // Waits for server response:
  const serverData = await fetch("http://127.0.0.1:8080/challenge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playerPosition),
  }).then((response) => {
    return response.json();
  });

  console.log(serverData);
  // Checks if there's a winner this turn:
  if (serverData.winner === "o") {
    winner = "o";
  } else if (serverData.winner === "x") {
    winner = "x";
  }

  // Uses position provided to select slot:
  // const y = gameBoard.rows[serverData.y];
  // const x = y.children[serverData.x];

  // Stores and styles html element:
  // const move = x.firstChild;
  // move.textContent = "x";
  // move.setAttribute("class", "x");
  // computerTiles.push(move);

  VerifyBoard();
  x1 = -1;
  x2 = -1;
  y1 = -1;
  y2 = -1;
  player1 = false;
  player2 = false;
}

// Removes all events and reinitialises game board and variables:
function Restart() {
  playerTiles = [];
  computerTiles = [];
  turn = true;
  x1 = -1;
  x2 = -1;
  y1 = -1;
  y2 = -1;
  player1 = false;
  player2 = false;
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
      console.log("Player " + winner + " has won the game !");
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
