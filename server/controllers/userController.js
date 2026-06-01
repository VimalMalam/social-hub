import db from "../config/db.js";

// GET PROFILE
export const getProfile = (req, res) => {
    try {
        const profileId = req.params.id;
        const loggedInUser = req.user.id;

        db.query("CALL GetUserProfile(?, ?)", [profileId, loggedInUser], (err, result) => {
            if (err) {
                console.log("FULL PROFILE ERROR => ", err);

                return res.status(500).json({
                    message: err.message
                });
            }

            // NO USER FOUND
            if (!result[0].length) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.status(200).json(
                result[0][0]
            );
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// GET USER POSTS
export const getUserPosts = (req, res) => {
    try {
        const userId = req.params.id;

        db.query("CALL GetUserPosts(?)", [userId], (err, result) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(200).json(
                result[0]
            );
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

// FOLLOW USER
export const followUser = (req, res) => {
    try {
        const followerId = req.user.id;
        const { followingId } = req.body;

        db.query("CALL FollowUser(?, ?)", [followerId, followingId], (err, result) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(200).json({
                message: "User Followed"
            });
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

// UNFOLLOW USER
export const unfollowUser = (req, res) => {
    try {
        const followerId = req.user.id;
        const { followingId } = req.body;

        db.query("CALL UnFollowUser(?, ?)", [followerId, followingId], (err, result) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(200).json({
                message: "User Unfollowed"
            });
        })
    } catch (error) {
        res.status(500).json(error);
    }
};

// UPDATE PROFILE
export const updateProfile = (req, res) => {
    try {
        const userId = req.user.id;
        const { bio } = req.body;
        const profilePic = req.file?.path || null;

        db.query("CALL UpdateProfile(?, ?, ?)", [userId, bio, profilePic], (err, result) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(200).json({
                message: "Profile Updated"
            });
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

// CHECK FOLLOWER STATUS
export const checkFollowStatus = (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = req.params.id;
        db.query(
            "CALL CheckFollow(?, ?)",
            [followerId, followingId],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: err.message
                    });
                }
                res.status(200).json({
                    following: result[0].length > 0
                });
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// FOLLOW STATS
export const getFollowStats = (req, res) => {
    try {
        const userId = req.params.id;
        db.query(
            "CALL GetFollowersCount(?)",
            [userId],
            (err, followersResult) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: err.message
                    });
                }
                db.query(
                    "CALL GetFollowingCount(?)",
                    [userId],
                    (err, followingResult) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                message: err.message
                            });
                        }
                        res.status(200).json({
                            followers:
                                followersResult[0][0].followers,
                            following:
                                followingResult[0][0].following
                        });
                    }
                );
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// GET CURRENT USER
export const getCurrentUser = (req, res) => {
    try {
        const userId = req.user.id;
        db.query(
            `
            SELECT
                id,
                username,
                email,
                profile_pic,
                bio,
                role
            FROM users
            WHERE id = ?
            `,
            [userId],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: err.message
                    });
                }
                res.status(200).json(
                    result[0][0]
                );
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// GET RANDOM USERS
export const getSuggestedUsers = (req, res) => {

    try {
        const loggedInUser = req.user.id;
        db.query(
            "CALL GetSuggestedUsers(?)", [loggedInUser], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: err.message
                    });
                }
                res.status(200).json(result[0]);
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// SEARCH USERS
export const searchUsers = (req, res) => {
    try {
        const search = req.query.search;

        db.query(
            "CALL SearchUsers(?)", [search], (err, result) => {
                if (err) {
                    console.log(err)

                    return res.status(500).json({
                        message: err.message
                    });
                }

                res.status(200).json(
                    result[0]
                );
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json(error);
    }
}