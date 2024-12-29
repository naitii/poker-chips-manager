import dotenv from "dotenv";
import express from "express";
import connectToDatabase from "./db/connectdb.js";
import userRoutes from "./routes/userRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

const app = express();

dotenv.config();
const connectionString = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
connectToDatabase(connectionString);

app.use("/user", userRoutes);
app.use("/game/", gameRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
