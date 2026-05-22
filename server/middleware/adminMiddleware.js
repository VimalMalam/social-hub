export const verifyAdmin = (req, res, next) => {
    try {
        if (req.user.role != "admin") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    } catch (error) {
        res.status(500).json(error);
    }
}