import db from "../config/db.js";

export const savePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.body;

        db.query(
            "CALL SavePost(?, ?)", [userId, postId], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: err.message });
                }

                res.status(200).json({ message: "Post saved" });
            }
        );
    } catch (error) {
        res.status(500).json(error);
    }
};

export const unsavePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.body;

        db.query(
            "CALL UnsavePost(?, ?)", [userId, postId], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: err.message });
                }

                res.status(200).json({ message: "Post unsaved" });
            }
        );
    } catch (error) {
        res.status(500).json(error);
    }
};

export const checkSavedPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        db.query(
            "CALL CheckSavedPost(?, ?)", [userId, postId], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: err.message });
                }
                res.status(200).json({ saved: result[0].length > 0 });
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const getSavedPosts = async (req, res) => {
    try {
        const userId = req.user.id;

        db.query(
            "CALL GetSavedPosts(?)", [userId], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: err.message });
                }
                res.status(200).json(result[0]);
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};