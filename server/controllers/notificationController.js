import db from "../config/db.js";

// GET NOTIFICATIONS
export const getNotifications = (req, res) => {
    try {
        const userId = req.user.id;

        db.query(
            "CALL GetNotifications(?)",
            [userId],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: err.message
                    });
                }

                res.status(200).json(
                    result[0]
                );
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};