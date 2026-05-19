import db from "../config/db.js";

// CREATE POST
export const createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { caption } = req.body;
        const image = req.file?.path;

        if (!image) {
            return res.status(400).json({ message: "Image id required" });
        }

        db.query(
            "CALL CreatePost(?, ?, ?)", [userId, caption, image], (err, result) => {
                if (err) {
                    console.log(err);

                    return res.status(500).json({ message: err.message });
                }

                res.status(201).json({ message: "Post created successfully" });
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json(error);
    }
};

// GET ALL POSTS
export const getPosts = (req, res) => {
    try {
        db.query(
            "CALL GetPosts()", (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: err.message });
                }

                res.status(200).json(result[0]);
            }
        );
    } catch (error) {
        res.ststus(500).json(error);
    }
};