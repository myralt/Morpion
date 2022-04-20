// SERVER-SIDE LOGIC

const express = require("express");
const cors = require("cors");

const api = express();

api.use(cors());
api.use("/", express.static(__dirname + "/public"));

api.listen(8080, () => {
  console.log("Server running at http://127.0.0.1:8080/");
});
