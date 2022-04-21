// SERVER-SIDE LOGIC

const express = require("express");
const cors = require("cors");

//Initialises empty game board:
let gameBoard = [
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
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

  // Stores player's latest move:
  const playerPosition = {
    x: data.x,
    y: data.y,
  };
  gameBoard[playerPosition.y][playerPosition.x] = "o";

  // Scans board to determine next move and returns results as object:
  //const result = scanBoard(gameBoard);
  const result = playerPosition;

  // Sends object to client:
  response.writeHead(200, {
    "Content-Type": "application/json",
  });
  response.send(JSON.stringify(result));
};

// Starts server to listen for http requests at port 8080:
api.listen(8080, () => {
  console.log("Server running at http://127.0.0.1:8080/");

  // Route to challenges AI:
  api.post("/challenge", toClient);
});

// All functions --------------------------------------------------

function scanBoard(board) {
  let bestMoveValue = -1000;
  let result = {
    x: -1,
    y: -1,
    winner: isWinner(board),
  };
  if (result.winner) {
    return result;
  }
  for (const row of board) {
    for (const col of board) {
      if (board[row][col] === " ") {
        board[row][col] = "o";
        let moveValue = RunSimulation(board, 0, false);
        board[row][col] = " ";
        if (moveValue > bestMoveValue) {
          result.y = row;
          result.x = col;
          bestMoveValue = moveValue;
        }
      }
    }
  }
  return result;
}

function isWinner(board) {
  let player = "o";
  let computer = "x";

  for (const row of board) {
    for (const col of row) {
      // Checks if 3 tiles align vertically:
      if (VerticalCheck(board, player, col, row)) {
        return player;
      } else if (VerticalCheck(board, computer, col, row)) {
        return computer;
      }
      // Checks if 3 tiles align horizontally:
      if (HorizontalCheck(board, player, col, row)) {
        return player;
      } else if (HorizontalCheck(board, computer, col, row)) {
        return computer;
      }
      // Checks if 3 tiles align diagonally:
      if (DiagonalCheck(board, player, col, row)) {
        return player;
      } else if (DiagonalCheck(board, computer, col, row)) {
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
  if (row < 6 && col < 6) {
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

function RunSimulation(board, depth, isMax) {}

// let score = evaluate(board);

//     // If Maximizer has won the game
//     // return his/her evaluated score
//     if (score == 10)
//         return score;

//     // If Minimizer has won the game
//     // return his/her evaluated score
//     if (score == -10)
//         return score;

//     // If there are no more moves and
//     // no winner then it is a tie
//     if (isMovesLeft(board) == false)
//         return 0;

//     // If this maximizer's move
//     if (isMax)
//     {
//         let best = -1000;

//         // Traverse all cells
//         for(let i = 0; i < 3; i++)
//         {
//             for(let j = 0; j < 3; j++)
//             {

//                 // Check if cell is empty
//                 if (board[i][j]=='_')
//                 {

//                     // Make the move
//                     board[i][j] = player;

//                     // Call minimax recursively
//                     // and choose the maximum value
//                     best = Math.max(best, minimax(board,
//                                     depth + 1, !isMax));

//                     // Undo the move
//                     board[i][j] = '_';
//                 }
//             }
//         }
//         return best;
//     }

//     // If this minimizer's move
//     else
//     {
//         let best = 1000;

//         // Traverse all cells
//         for(let i = 0; i < 3; i++)
//         {
//             for(let j = 0; j < 3; j++)
//             {

//                 // Check if cell is empty
//                 if (board[i][j] == '_')
//                 {

//                     // Make the move
//                     board[i][j] = opponent;

//                     // Call minimax recursively and
//                     // choose the minimum value
//                     best = Math.min(best, minimax(board,
//                                     depth + 1, !isMax));

//                     // Undo the move
//                     board[i][j] = '_';
//                 }
//             }
//         }
//         return best;
//     }
