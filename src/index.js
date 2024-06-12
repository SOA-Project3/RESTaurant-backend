const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const menu = require("./models/menu.json");
const port = 3002;

const app = express(); //Main express app
const router = express.Router();
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan("tiny")); //Log request
app.use(bodyParser.json());

// Use the cors middleware
app.use(cors());

app.get("/menu", (req, res) => {
  res.json(menu);
});

app.use(router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = {
  app,
};
