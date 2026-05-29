import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/authMiddleware.js";

import "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// HTTP SERVER
const server = http.createServer(app);

// SOCKET SERVER
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ADD USER
    socket.on("addUser", (userId) => {
        const exists = onlineUsers.find(
            (user) => user.userId === userId
        );

        if (!exists) {
            onlineUsers.push({
                userId,
                socketId: socket.id
            });
        }

        io.emit(
            "getOnlineUsers",
            onlineUsers
        );
    });


    // SEND MESSAGE
    socket.on("sendMessage", (data) => {
        const receiver = onlineUsers.find(

            (user) =>
                user.userId === data.receiverId
        );

        if (receiver) {
            io.to(receiver.socketId).emit(
                "getMessage",
                data
            );
        }
    });


    // DISCONNECT
    socket.on("disconnect", () => {
        console.log("User disconnected");

        onlineUsers = onlineUsers.filter(
            (user) =>
                user.socketId !== socket.id
        );

        io.emit(
            "getOnlineUsers",
            onlineUsers
        );
    });

    // TYPING...
    socket.on("typing", (data) => {
        const receiver = onlineUsers.find((user) => user.userId === data.receiverId);

        if (receiver) {
            io.to(receiver.socketId).emit("showTyping", { senderId: data.senderId });
        }
    });

});

app.use(express.json());

app.use(cookieParser());


// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);


app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("/protected", verifyToken, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});


const PORT = process.env.PORT || 5000;

server.listen(5000, () => {
    console.log(
        "Server running on port 5000"
    );
});