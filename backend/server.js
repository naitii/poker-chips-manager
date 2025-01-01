import dotenv from "dotenv";
import express from "express";
import gameRoutes from "./routes/gameRoutes.js";
import actionRoutes from "./routes/actionRoutes.js";
import connectDb from "./db/connectdb.js";
import cors from "cors";
import http from "http";
import {Server} from "socket.io";
import path from "path";
import job from "./cron/cron.js";

const __dirname = path.resolve();

const app = express();
app.use(
  cors({
    origin: "https://poker-manager.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

//socket io

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://poker-manager.onrender.com",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
    
    socket.on("join_room", (id) => {
        socket.join(id);
    });

    socket.on("updateRoom",(data)=>{
        socket.to(data.roomId).emit("updateData", data.message);
    })
    socket.on("refreshRoom",(data)=>{
        socket.to(data.roomId).emit("refresh");
    });
});


dotenv.config();
const port = process.env.PORT || 3000;

connectDb();
job.start();

app.use(express.json());
app.use("/game", gameRoutes);
app.use("/action", actionRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) =>{
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
});

server.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
