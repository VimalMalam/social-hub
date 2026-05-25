import express, { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";
import { getAdminStats, getAllUsers, deleteUser } from "../controllers/adminController.js";

const router = express.Router();

// STATS
router.get("/stats", verifyToken, verifyAdmin, getAdminStats);

// USERS
router.get("/users", verifyToken, verifyAdmin, getAllUsers);

// DELETE USER
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUser);

export default router;