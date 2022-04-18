const playBtn = document.getElementById("play");
playBtn.addEventListener("click", (event) => {
  playBtn.setAttribute("disabled", "true");
  const allCells = document.querySelectorAll("td > div");
  allCells.forEach((cell) => {
    cell.addEventListener("click", applyEvents);
  });
});

function applyEvents(event) {
  const target = event.explicitOriginalTarget;
  target.innerHTML = "O";
}
