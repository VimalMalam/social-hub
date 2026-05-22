import express, { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";
import { getAdminStats } from "../controllers/adminController.js";

const router = express.Router();

// STATS
router.get("/stats", verifyToken, verifyAdmin, getAdminStats);

export default router;