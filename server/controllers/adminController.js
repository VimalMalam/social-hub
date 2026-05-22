import db from "../config/db.js";

// GET ADMIN STATS
export const getAdminStats = (req, res) => {
    try {
        db.query(
            "CALL GetAdminStats()", (err, result) => {
                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message: err.message
                    });
                }

                res.status(200).json(result[0][0]);
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json(error);
    }
}