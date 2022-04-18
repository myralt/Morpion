let playerPawns = [];
let computerPawns = [];
const gameBoard = 64;
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
  console.log("clicked");
  VerifySpace();
}

function ComputerAction() {
  fetch("http://127.0.0.1:8080")
    .then((response) => {
      return response.json();
    })
    .then((data) => console.log(data));
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

function VerifySpace() {
  if (playerPawns.length + computerPawns.length === 64) {
    console.log("Game over, no space left!");
    allCells.forEach((cell) => {
      cell.removeEventListener("click", PlayerAction);
    });
  }
}
