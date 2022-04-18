const playBtn = document.getElementById("play");
const restartBtn = document.getElementById("restart");
restartBtn.setAttribute("disabled", "true");
playBtn.addEventListener("click", (event) => {
  playBtn.setAttribute("disabled", "true");
  restartBtn.removeAttribute("disabled");
  const allCells = document.querySelectorAll("td > div");
  allCells.forEach((cell) => {
    cell.addEventListener("click", applyEvents);
  });
});

function applyEvents(event) {
  const target = event.explicitOriginalTarget;
  target.innerHTML = "O";
}
