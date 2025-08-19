import express from "express";
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDb } from "./lib/db.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { Server } from "socket.io";


const app = express()

const server = http.createServer(app)

// socket ko setup krna 
export const io = new Server(server, {
    cors: { origin: "*" }
})


//store online user
export const userSocketMap = {} // {userid : socketid}   all the data will store

// socket connection AsyncHandler
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
 console.log("User connected",userId);
 
 if(userId) userSocketMap[userId] = socket.id;

 // emit online user to all connected clients

 io.emit("getOnlineUsers",Object.keys(userSocketMap));

 socket.on("disconnect",()=>{
 console.log("User Disconnected",userId)
 delete userSocketMap[userId]
 io.emit("getOnlineUsers",Object.keys(userSocketMap))
 })

})




// middleware
app.use(express.json({ limit: "4mb" }))
app.use(cors())

// route
app.use("/api/status", (req, res) => res.send("Server is live"))
app.use("/api/auth", userRouter);

app.use("/api/messages", messageRouter)

// connect databSE
await connectDb();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log("Server is running on PORT :" + PORT))