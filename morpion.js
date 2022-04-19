let playerPawns = [];
let computerPawns = [];
let winner;
const gameBoard = document.getElementById("game-board");
const maxGridSpace = 64;
const allCells = document.querySelectorAll("td > div");
const playBtn = document.getElementById("play");
const restartBtn = document.getElementById("restart");
restartBtn.setAttribute("disabled", "true");
playBtn.addEventListener("click", (event) => {
  playBtn.setAttribute("disabled", "true");
  restartBtn.removeAttribute("disabled");
  restartBtn.addEventListener("click", Restart);
  allCells.forEach((cell) => {
    cell.addEventListener("click", PlayerAction);
  });
});

function PlayerAction(event) {
  const target = event.explicitOriginalTarget;
  target.innerHTML = "O";
  playerPawns.push(target);
  //const position = the grid coordinates as object
  console.log("clicked");
  VerifyBoard();
  //ComputerAction(position);
}

function ComputerAction(playerPosition) {
  fetch("http://127.0.0.1:8080")
    .then((response) => {
      return response.json();
    })
    .then((data) => console.log(data));
  //VerifyBoard();
}

function Restart() {
  playerPawns = [];
  computerPawns = [];
  allCells.forEach((cell) => {
    cell.removeEventListener("click", PlayerAction);
    cell.innerHTML = "";
    cell.style.backgroundColor = "grey";
  });
  restartBtn.setAttribute("disabled", "true");
  playBtn.removeAttribute("disabled");
}

function VerifyBoard() {
  if (playerPawns.length + computerPawns.length === maxGridSpace || winner) {
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
