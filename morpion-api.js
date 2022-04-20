// SERVER-SIDE LOGIC

const express = require("express");
const cors = require("cors");
const { appendFile } = require("fs");

const api = express();

api.use(cors());
api.use("/", express.static(__dirname + "/public"));

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
  });
  response.end(JSON.stringify(playerPosition));
};

api.listen(8080, () => {
  console.log("Server running at http://127.0.0.1:8080/");
  api.post("/challenge", toClient);
});
