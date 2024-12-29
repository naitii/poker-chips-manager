import dotenv from "dotenv";
import express from "express";
import gameRoutes from "./routes/gameRoutes.js";
import connectDb from "./db/connectdb.js";

const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
connectDb();

app.use(express.json());
app.use("/game", gameRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
