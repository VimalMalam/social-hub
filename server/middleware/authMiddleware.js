import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        // Check Authorization header first
        let token = req.headers.authorization?.split(" ")[1];
        
        // If no Authorization header, check cookies
        if (!token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};