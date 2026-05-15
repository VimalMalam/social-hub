import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/authMiddleware.js";

import "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());


// ROUTES
app.use("/api/auth", authRoutes);


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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});