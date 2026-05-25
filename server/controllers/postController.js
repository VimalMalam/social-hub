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
        const userId = req.user.id;

        db.query(
            "CALL GetPosts(?)", [userId], (err, result) => {
                if (err) {
                    console.log(err);

                    return res.status(500).json({ message: err.message });
                }

                res.status(200).json(result[0]);
            }
        );
    } catch (error) {
        res.status(500).json(error);
    }
};

// LIKE POST
export const likePost = (req, res) => {
    try {
        const userId = req.user.id;

        const { postId } = req.body;

        db.query("CALL LikePost(?, ?)", [userId, postId], (err, result) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(200).json({
                message: "Post Liked"
            });
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

// UNLIKE POST
export const unlikePost = (req, res) => {
    try {
        const userId = req.user.id;

        const { postId } = req.body;

        db.query("CALL UnlikePost(?, ?)", [userId, postId], (err, result) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(200).json({
                message: "Post Unliked"
            });
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

// ADD COMMENT
export const addComment = (req, res) => {
    try {
        const userId = req.user.id;

        const { postId, comment } = req.body;

        db.query("CALL AddComment(?, ?, ?)", [userId, postId, comment], (err, result) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(200).json({
                message: "Comment Added"
            });
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

// GET COMMENTS
export const getComments = (req, res) => {
    try {
        const { postId } = req.params;

        db.query("CALL GetComments(?)", [postId], (err, result) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(200).json(result[0]);
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

// REPORT POST
export const reportPost = (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        const { reason } = req.body;

        db.query(
            "CALL ReportPost(?, ?, ?)", [userId, postId, reason], (err) => {
                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message: err.message
                    });
                }

                res.status(200).json({
                    message: "Post reported"
                });
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json(error);
    }
}