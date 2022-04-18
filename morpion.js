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

  fetch("http://127.0.0.1:8080")
    .then((response) => {
      return response.json();
    })
    .then((data) => console.log(data));
}
