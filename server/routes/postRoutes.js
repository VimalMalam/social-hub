import express from 'express';
import {createPost, getPosts } from "../controllers/postController.js";
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// CREATE POST
router.post("/create", verifyToken, upload.single("image"), createPost);

// GET ALL POSTS
router.get("/all", verifyToken, getPosts);

export default router;