const board = document.getElementById("board");
const statusDisplay = document.getElementById("status");
const resetButton = document.getElementById("reset");
const modeSelection = document.getElementById("modeSelection");
const gameContainer = document.getElementById("gameContainer");
const playerVsPlayerButton = document.getElementById("playerVsPlayer");
const playerVsAIButton = document.getElementById("playerVsAI");

let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let vsAI = false; // Flag for AI mode

// Winning conditions
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Handle cell click
function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedIndex = clickedCell.getAttribute("data-index");

  if (gameState[clickedIndex] !== "" || !gameActive) return;

  gameState[clickedIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add("taken");

  checkGameStatus();

  if (gameActive && vsAI && currentPlayer === "X") {
    currentPlayer = "O";
    statusDisplay.textContent = `AI's Turn`;
    setTimeout(aiMove, 500); // AI plays after 500ms
  } else if (gameActive) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

// AI logic
function aiMove() {
  const emptyCells = gameState
    .map((cell, index) => (cell === "" ? index : null))
    .filter((index) => index !== null);

  if (emptyCells.length > 0) {
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[randomIndex] = "O";

    const cell = document.querySelector(`[data-index='${randomIndex}']`);
    cell.textContent = "O";
    cell.classList.add("taken");

    checkGameStatus();

    if (gameActive) {
      currentPlayer = "X";
      statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    }
  }
}

// Check game status
function checkGameStatus() {
  let roundWon = false;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (
      gameState[a] !== "" &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusDisplay.textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;
    return;
  }

  if (!gameState.includes("")) {
    statusDisplay.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }
}

// Reset game
function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusDisplay.textContent = `Player X's Turn`;
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken");
  });
}

// Select mode
playerVsPlayerButton.addEventListener("click", () => {
  vsAI = false;
  modeSelection.classList.add("hidden");
  gameContainer.classList.remove("hidden");
});

playerVsAIButton.addEventListener("click", () => {
  vsAI = true;
  modeSelection.classList.add("hidden");
  gameContainer.classList.remove("hidden");
});

// Add event listeners
board.addEventListener("click", handleCellClick);
resetButton.addEventListener("click", resetGame);
