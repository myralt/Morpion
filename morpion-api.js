// SERVER-SIDE LOGIC

const express = require("express");
const cors = require("cors");

//Initialises empty game board:
let gameBoard = [
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
];

// Instantiates web api:
const api = express();

// Sets additional middleware:
// Prevents CORS issues:
api.use(cors());
// Serves the game files in public directory at startup:
api.use("/", express.static(__dirname + "/public"));

// The callback function to use when challenging AI
const toClient = async (request, response) => {
  // Waits for all network packets and converts them to an object:
  const buffers = [];
  for await (const chunk of request) {
    buffers.push(chunk);
  }
  const clientData = Buffer.concat(buffers).toString();
  const data = JSON.parse(clientData);

  // Stores players' latest move:
  const player1Position = {
    x: data.player1.x,
    y: data.player1.y,
  };
  gameBoard[player1Position.y][player1Position.x] = "o";

  const player2Position = {
    x: data.player2.x,
    y: data.player2.y,
  };
  gameBoard[player2Position.y][player2Position.x] = "x";

  // Scans board to determine next move and returns results as object:
  const result = scanBoard(gameBoard);
  // gameBoard[result.y][result.x] = "x";
  //const result = playerPosition;

  // Sends object to client:
  response.writeHead(200, {
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(result));
};

// Starts server to listen for http requests at port 8080:
api.listen(8080, () => {
  console.log("Server running at http://127.0.0.1:8080/");

  // Route to challenges AI:
  api.post("/challenge", toClient);
});

// All functions --------------------------------------------------

function scanBoard(board) {
  //let bestMoveValue = -1000;
  let result = {
    winner: isWinner(board),
  };
  if (result.winner) {
    return result;
  }
  // for (const row of board) {
  //   for (let col of row) {
  // if (col === ".") {
  //   col = "x";
  //   let moveValue = RunSimulation(board, 0, false);
  //   col = ".";
  //   if (moveValue > bestMoveValue) {
  //     result.y = row;
  //     result.x = col;
  //     bestMoveValue = moveValue;
  // }
  // }
  //   }
  // }
  return result;
}

function isWinner(board) {
  let player = "o";
  let computer = "x";

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      // Checks if 3 tiles align vertically:
      if (VerticalCheck(board, player, j, i)) {
        return player;
      } else if (VerticalCheck(board, computer, j, i)) {
        return computer;
      }
      // Checks if 3 tiles align horizontally:
      if (HorizontalCheck(board, player, j, i)) {
        return player;
      } else if (HorizontalCheck(board, computer, j, i)) {
        return computer;
      }
      // Checks if 3 tiles align diagonally:
      if (DiagonalCheck(board, player, j, i)) {
        return player;
      } else if (DiagonalCheck(board, computer, j, i)) {
        return computer;
      }
    }
  }
  // No winner:
  return;
}

function VerticalCheck(board, tile, col, row) {
  if (row >= 6) {
    return false;
  } else if (board[row + 1][col] === tile && board[row + 2][col] === tile) {
    return true;
  }
  return false;
}

function HorizontalCheck(board, tile, col, row) {
  if (col < 7) {
    if (board[row][col - 1] === tile && board[row][col + 1] === tile) {
      return true;
    }
    if (col < 6) {
      if (board[row][col + 1] === tile && board[row][col + 2] === tile) {
        return true;
      }
    }
    if (col > 1) {
      if (board[row][col - 1] === tile && board[row][col - 2] === tile) {
        return true;
      }
    }
  }
}

function DiagonalCheck(board, tile, col, row) {
  if (row > 1 && row < 6 && col > 1) {
    if (board[row - 1][col - 1] === tile && board[row - 2][col - 2] === tile) {
      return true;
    }
    if (board[row + 1][col - 1] === tile && board[row + 2][col - 2] === tile) {
      return true;
    }
  }
  if (row > 2 && row < 6 && col > 2 && col < 6) {
    if (board[row - 1][col + 1] === tile && board[row - 2][col + 2] === tile) {
      return true;
    }
    if (board[row + 1][col + 1] === tile && board[row + 2][col + 2] === tile) {
      return true;
    }
  }
  if (col > 0 && col < 7 && row < 7 && row > 0) {
    if (board[row - 1][col + 1] === tile && board[row + 1][col - 1] === tile) {
      return true;
    }
    if (board[row + 1][col + 1] === tile && board[row - 1][col - 1] === tile) {
      return true;
    }
  }
}

function RunSimulation(board, depth, isMax) {
  let winner = isWinner(board);
  let noSpace;
  if (winner === "o") return -10;
  if (winner === "x") return 10;
  for (const row of board) {
    for (const col of row) {
      if (col == ".") noSpace = false;
    }
  }
  if (noSpace) return 0;
  // The MiniMax AI algorithm, implemented in javascript, credit to creator of MiniMax:
  if (isMax) {
    let bestMoveValue = -1000;
    for (const row of board) {
      for (let col of row) {
        // Check if cell is empty
        if (col === ".") {
          // Make the move
          col = "x";
          // Call minimax recursively
          // and choose the maximum value
          bestMoveValue = Math.max(
            bestMoveValue,
            RunSimulation(board, depth + 1, !isMax)
          );
          // Undo the move
          col = ".";
        }
      }
    }
    return bestMoveValue;
  } else {
    let bestMoveValue = 1000;
    for (const row of board) {
      for (let col of row) {
        // Check if cell is empty
        if (col === ".") {
          // Make the move
          col = "o";
          // Call minimax recursively and
          // choose the minimum value
          bestMoveValue = Math.min(
            bestMoveValue,
            RunSimulation(board, depth + 1, !isMax)
          );
          // Undo the move
          col = ".";
        }
      }
    }
    return bestMoveValue;
  }
}
