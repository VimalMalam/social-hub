import express from 'express';
import { register, login, logout, sendOTP, verifyOTP } from '../controllers/authController.js';

const router = express.Router();

// ROUTES
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;