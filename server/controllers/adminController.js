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

// GET ALL USERS
export const getAllUsers = (req, res) => {
    try {
        db.query(
            "CALL GetAllUsersForAdmin()", (err, result) => {
                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message: err.message
                    });
                }

                res.status(200).json(result[0]);
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json(error);
    }
};

// DELETE USER
export const deleteUser = (req, res) => {
    try {
        const userId = req.params.id;

        db.query(
            "CALL DeleteUserByAdmin(?)", [userId], (err) => {
                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message: err.message
                    });
                }

                res.status(200).json({
                    message: "User Deleted"
                });
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json(error);
    }
}