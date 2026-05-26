import express from "express";
import { createConversation, sendMessage } from "../controllers/chatController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE CONVERSATION
router.post("/conversation", verifyToken, createConversation);

// SEND MESSAGE
router.post("/message", verifyToken, sendMessage);

export default router;