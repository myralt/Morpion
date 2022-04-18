const http = require("http");

const toClient = (request, response) => {
  const method = request.method;
  const test = {
    method: method,
    message: "all good",
  };
  response.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  response.end(JSON.stringify(test));
};

const server = http.createServer(toClient);
server.listen(8080);
console.log("Server running at http://127.0.0.1:8080/");
