import dotenv from "dotenv";
import express from "express";
import connectToDatabase from "./db/connectdb.js";
const app = express();
dotenv.config();
const connectionString = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectToDatabase(connectionString);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});