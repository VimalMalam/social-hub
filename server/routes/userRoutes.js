import express from "express";
import { getProfile, getUserPosts, followUser, unfollowUser, updateProfile, getCurrentUser, getSuggestedUsers, searchUsers } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// GET PROFILE
router.get("/profile/:id", verifyToken, getProfile);

// GET USER POSTS
router.get("/posts/:id", verifyToken, getUserPosts);

// FOLLOW USER
router.post("/follow", verifyToken, followUser);

// UNFOLLOW USER
router.post("/unfollow", verifyToken, unfollowUser);

// UPDATE PROFILE
router.put("/update", verifyToken, upload.single("profile_pic"), updateProfile);

// GET CURRENT USER
router.get("/me", verifyToken, getCurrentUser);

// GET RANDOM USERS
router.get("/suggested", verifyToken, getSuggestedUsers);

// SEARCH USERS
router.get("/search", verifyToken, searchUsers);

export default router;