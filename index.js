const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// Middlewares
app.use(cors());
app.use(express.json());

// Initial Message
app.get("/", (req, res) => {
  res.send("Car Bazar server running........");
});

app.listen(port, () => {
  console.log(`Car Bazar server running on localhost: ${port}`);
});

// MongoDB connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uue1axy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const carsCollection = client
      .db("car_bazar")
      .collection("reconditioned_cars");

    app.get("/cars", async (req, res) => {
      const query = {};
      const cars = await carsCollection.find(query).toArray();
      res.send(cars);
    });

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: ObjectId(id),
      };
      const cars = await carsCollection.find(query).toArray();
      res.send(cars);
    });
  } finally {
  }
}
run().catch(console.log);
