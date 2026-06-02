import jwt from "jsonwebtoken";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

import { transporter } from "../config/mailer.js";
import { otpStore } from "../utils/otpStore.js";
import dotenv from "dotenv";

dotenv.config();

// Generate JWT token
export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

// REGISTER
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // VALIDATION
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // CALLED STORED PROCEDURE
        db.query("CALL RegisterUser(?, ?, ?)", [username, email, hashedPassword], (err, result) => {
            if (err) {
                // DUPLICATE EMAIL
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        message: "Email or Username already exists"
                    });
                }
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "User registered successfully"
            });
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

// LOGIN
export const login = (req, res) => {
    try {
        const { email, password } = req.body;

        // CHECK INPUTS
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // CALL STORED PROCEDURE
        db.query("CALL LoginUser(?)", [email], async (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            const user = result[0][0];

            // USER NOT FOUND
            if (!user) {
                return res.status(400).json({
                    message: "User not found"
                });
            }

            // CHECK PASSWORD
            const isMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid credentials"
                });
            }

            // SEND OTP
            const otp = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            otpStore[email] = otp;

            setTimeout(() => {

                delete otpStore[email];

            }, 5 * 60 * 1000);


            // SEND EMAIL
            await transporter.sendMail({

                from: process.env.EMAIL_USER,

                to: email,

                subject: "Login OTP",

                html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px; text-align: center;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    
    <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">Secure Login</h2>
    
    <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
      Here is your One-Time Password (OTP) to securely log in to your account.
    </p>
    
    <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
      <h1 style="margin: 0; font-size: 36px; letter-spacing: 6px; color: #0056b3;">
        ${otp}
      </h1>
    </div>
    
    <p style="color: #777777; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
      This code will expire in <strong>10 minutes</strong>.<br>
      If you didn't request this email, you can safely ignore it.
    </p>
    
  </div>
</div>`
            });

            res.status(200).json({
                message: "OTP sent to email",
                user,
            });
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

// FINAL LOGIN AFTER OTP VERIFICATION
export const completeLogin = (req, res) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.status(400).json({
                message: "User data is missing"
            });
        }

        // GENERATE TOKEN
        const token = generateToken(user);

        // STORE TOKEN IN HTTP-ONLY COOKIE
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

// LOGOUT
export const logout = (req, res) => {

    res.clearCookie("token");

    res.status(200).json({
        message: "Logout successful"
    });

};

// SEND OTP
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        // GENERATE 6-DIGIT OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // STORE OTP TEMPORARILY
        otpStore[email] = otp;

        // AUTO DELETE OTP AFTER 5 MINUTES
        setTimeout(() => {
            delete otpStore[email];
        }, 5 * 60 * 1000);

        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

        // SEND EMAIL
        await transporter.sendMail({
            from: process.env.EMAIL_USER,

            to: email,

            subject: "Your OTP Code",

            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px; text-align: center;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <h2 style="color: #111827; margin-top: 0; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Welcome! We're excited to have you. To complete your registration and secure your account, please enter the verification code below:
    </p>
    
    <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
      <h1 style="margin: 0; font-size: 36px; letter-spacing: 8px; color: #2563eb;">
        ${otp}
      </h1>
    </div>
    
    <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
      This verification code will expire in <strong>5 minutes</strong>.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
    
    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
      If you did not sign up for this account, you can safely ignore this email. Someone else might have typed your email address by mistake.
    </p>
    
  </div>
</div>
            `
        });

        res.status(200).json({
            message: "OTP sent to email"
        });
    } catch (error) {
        console.log("SEND OTP ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// VERIFY OTP
export const verifyOTP = (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const storedOTP = otpStore[email];

        if (!storedOTP) {
            return res.status(400).json({
                message: "OTP expired or not found"
            });
        }

        if (storedOTP !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // REMOVE OTP AFTER VERIFICATION
        delete otpStore[email];

        res.status(200).json({
            message: "OTP verified successfully"
        });
    } catch (error) {
        res.status(500).json(error);
    }
};