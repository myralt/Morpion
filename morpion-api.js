// SERVER-SIDE LOGIC

// All server variables ----------------------------------------
const http = require("http");

// Reacts to client requests and applies corresponding actions:
const toClient = async (request, response) => {
  const buffers = [];
  for await (const chunk of request) {
    buffers.push(chunk);
  }
  const clientData = Buffer.concat(buffers).toString();
  const data = JSON.parse(clientData);
  const playerPosition = {
    x: data.x,
    y: data.y,
  };
  response.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  response.end(JSON.stringify(playerPosition));
};

// Instantiates server:
const server = http.createServer(toClient);

// Starts server:
server.listen(8080);
console.log("Server running at http://127.0.0.1:8080/");
