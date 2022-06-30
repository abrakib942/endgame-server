const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.estsi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const todoCollection = client.db("endgame").collection("todo-lists");
    const completeCollection = client
      .db("endgame")
      .collection("completed-lists");

    app.post("/todo", async (req, res) => {
      const addTask = req.body;
      const result = await todoCollection.insertOne(addTask);
      res.send(result);
    });

    app.get("/todo", async (req, res) => {
      const result = await todoCollection.find({}).toArray();
      res.send(result.reverse());
    });

    app.put("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const task = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: task,
      };
      const result = await todoCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.post("/complete", async (req, res) => {
      const completeTask = req.body;
      const result = await completeCollection.insertOne(completeTask);
      res.send(result);
    });

    app.get("/complete", async (req, res) => {
      const result = await completeCollection.find({}).toArray();
      res.send(result);
    });

    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await todoCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
    //
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello from endgame todo");
});

app.listen(port, () => {
  console.log("endgame is running to", port);
});
