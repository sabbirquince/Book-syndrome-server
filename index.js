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
  const orderCollection = client.db("book-syndrome").collection("orders");

  app.post("/addBook", (req, res) => {
    const bookInfo = req.body;
    collection
      .insertOne(bookInfo)
      .then((result) => res.send(result.insertedCount > 0));
  });

  app.get("/books", (req, res) => {
    collection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });

  app.delete("/deleteBook", (req, res) => {
    const id = req.query.id;

    collection
      .deleteOne({ _id: ObjectId(id) })
      .then((result) => res.send(result.deletedCount > 0));
  });

  app.get("/checkout/:bookId", (req, res) => {
    const id = req.params.bookId;

    collection.find({ _id: ObjectId(id) }).toArray((err, docs) => {
      res.send(docs[0]);
    });
  });

  app.post("/placedOrder", (req, res) => {
    const placedOrder = req.body;

    orderCollection
      .insertOne(placedOrder)
      .then((result) => res.send(result.insertedCount > 0));
  });

  app.post("/myOrder", (req, res) => {
    const { email } = req.body;

    orderCollection.find({ email: email }).toArray((err, docs) => {
      res.send(docs);
    });
  });
});

app.listen(port);
