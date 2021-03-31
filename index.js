const express = require("express");
const app = express();
const port = process.env.PORT || 4022;
require("dotenv").config();
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kyzsc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const ObjectId = require("mongodb").ObjectID;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const collection = client.db("book-syndrome").collection("books");

  app.post("/addBook", (req, res) => {
    const bookInfo = req.body;
    collection
      .insertOne(bookInfo)
      .then((result) => res.send(result.insertedCount > 0));
  });

  app.get("/books", (req, res) => {
    collection.find({}).toArray((err, docs) => {
      res.send(docs);
      console.log(docs);
    });
  });

  app.delete("/deleteBook", (req, res) => {
    const id = req.query.id;

    collection
      .deleteOne({ _id: ObjectId(id) })
      .then((result) => res.send(result.deletedCount > 0));
  });
});

app.listen(port);
