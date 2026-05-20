import express from 'express';
import {createPost, getPosts, likePost, unlikePost, addComment, getComments } from "../controllers/postController.js";
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// CREATE POST
router.post("/create", verifyToken, upload.single("image"), createPost);

// GET ALL POSTS
router.get("/all", verifyToken, getPosts);

// LIKE POST
router.post("/like", verifyToken, likePost);

// UNLIKE POST
router.post("/unlike", verifyToken, unlikePost);

// ADD COMMENT
router.post("/comment", verifyToken, addComment);

// GET COMMENTS
router.get("/comments/:postId", verifyToken, getComments);

export default router;