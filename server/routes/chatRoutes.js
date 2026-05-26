import express from "express";
import { createConversation, sendMessage, getConversations, getMessages } from "../controllers/chatController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE CONVERSATION
router.post("/conversation", verifyToken, createConversation);

// SEND MESSAGE
router.post("/message", verifyToken, sendMessage);

// GET CONVERSATION
router.get("/conversations", verifyToken, getConversations);

// GET MESSAGES
router.get("/messages/:id", verifyToken, getMessages);

export default router;