import dotenv from "dotenv";
import express from "express";
import gameRoutes from "./routes/gameRoutes.js";
import actionRoutes from "./routes/actionRoutes.js";
import connectDb from "./db/connectdb.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

dotenv.config();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
connectDb();

app.use(express.json());
app.use("/game", gameRoutes);
app.use("/action", actionRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
