import jwt from "jsonwebtoken";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

import { transporter } from "../config/mailer.js";
import { otpStore } from "../utils/otpStore.js";

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

            // GENERATE TOKEN
            const token = generateToken(user);

            // REMOVE PASSWORD
            delete user.password;

            // STORE TOKEN IN HTTP-ONLY COOKIE
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

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

                html: `
        <h1>${otp}</h1>
        <p>Your login OTP</p>
    `
            });

            res.status(200).json({
                message: "OTP sent to email",
                user,
                token
            });
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

        // SEND EMAIL
        await transporter.sendMail({
            from: process.env.EMAIL_USER,

            to: email,

            subject: "Your OTP Code",

            html: `
                <div style="font-family:sans-serif">
                    <h2>Email Verification</h2>

                    <p>Your OTP is:</p>

                    <h1>${otp}</h1>

                    <p>This OTP expires in 5 minutes.</p>
                </div>
            `
        });

        res.status(200).json({
            message: "OTP sent to email"
        });
    } catch (error) {
        res.status(500).json(error);
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