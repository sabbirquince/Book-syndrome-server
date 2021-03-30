const express = require("express");
const app = express();
const port = process.env.PORT || 4022;
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectID;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
