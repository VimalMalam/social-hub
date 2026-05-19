import express from 'express';
import { register, login, completeLogin, logout, sendOTP, verifyOTP } from '../controllers/authController.js';

const router = express.Router();

// ROUTES
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register", register);
router.post("/login", login);
router.post("/complete-login", completeLogin);
router.post("/logout", logout);

export default router;