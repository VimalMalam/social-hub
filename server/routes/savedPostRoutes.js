import express from "express";
import { savePost, unsavePost, checkSavedPost, getSavedPosts } from "../controllers/savedPostController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/save", verifyToken, savePost);
router.post("/unsave", verifyToken, unsavePost);
router.get("/check/:id", verifyToken, checkSavedPost);
router.get("/all", verifyToken, getSavedPosts);

export default router;