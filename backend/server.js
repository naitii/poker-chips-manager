import dotenv from "dotenv";
import express from "express";
import gameRoutes from "./routes/gameRoutes.js";
import actionRoutes from "./routes/actionRoutes.js";
import connectDb from "./db/connectdb.js";
import cors from "cors";
import http from "http";
import {Server} from "socket.io";


const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

//socket io

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
})
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});
connectDb();

app.use(express.json());
app.use("/game", gameRoutes);
app.use("/action", actionRoutes);

server.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
