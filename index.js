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
    const bookingCollection = client.db("car_bazar").collection("bookings");
    const accountCollection = client.db("car_bazar").collection("accounts");
    const sellerProductCollection = client
      .db("car_bazar")
      .collection("seller_products");

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

    // Catagory data load
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = {};
      const cursor = await carsCollection.find(query).toArray();
      const categorised_car = cursor.filter((n) => n.category_id === id);
      res.send(categorised_car);
    });

    // Booking Info
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const bookings = await bookingCollection.insertOne(booking);
      res.send(bookings);
    });

    app.get("/bookings", async (req, res) => {
      const query = {};
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    });

    // Email Query //
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = await bookingCollection.find(query).toArray();
      res.send(cursor);
    });

    // Users Info
    app.post("/accounts", async (req, res) => {
      const account = req.body;
      const accounts = await accountCollection.insertOne(account);
      res.send(accounts);
    });

    app.get("/accounts", async (req, res) => {
      const query = {};
      const accounts = await accountCollection.find(query).toArray();
      res.send(accounts);
    });

    app.get("/accounts", async (req, res) => {
      const query = {};
      const cursor = await accountCollection.find(query);
      const reviews = await cursor.toArray();
      const reverseArray = reviews.reverse();
      res.send(reverseArray);
    });
    app.post("/accounts", async (req, res) => {
      const user = req.body;
      const result = await accountCollection.insertOne(user);
      res.send(result);
    });
    app.put("/accounts/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await accountCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });
    app.get("/accounts/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await accountCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    // Seller Product API
    app.post("/myproducts", async (req, res) => {
      const myproduct = req.body;
      const myproducts = await sellerProductCollection.insertOne(myproduct);
      res.send(myproducts);
    });

    app.get("/myproducts", async (req, res) => {
      const query = {};
      const myproducts = await sellerProductCollection.find(query).toArray();
      res.send(myproducts);
    });
  } finally {
  }
}
run().catch(console.log);
