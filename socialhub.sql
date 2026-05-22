USE social_media_app;

SELECT * FROM users;

SELECT * FROM posts;

SELECT * FROM likes;

SELECT * FROM comments;

DESCRIBE users;

SHOW TABLES;

DROP PROCEDURE IF EXISTS GetUserProfile;

DELETE FROM users WHERE id = 6;

CREATE TABLE likes (
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (post_id)
    REFERENCES posts(id)
    ON DELETE CASCADE,

    UNIQUE(user_id, post_id)
);

CREATE TABLE comments (
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (post_id)
    REFERENCES posts(id)
    ON DELETE CASCADE
);

DELIMITER $$

CREATE PROCEDURE LikePost(
    IN p_user_id INT,
    IN p_post_id INT
)
BEGIN
    INSERT INTO likes(
        user_id,
        post_id
    )
    VALUES(
        p_user_id,
        p_post_id
    );
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UnlikePost(
	IN p_user_id INT,
    IN p_post_id INT
)
BEGIN
	DELETE FROM likes
    WHERE user_id = p_user_id
    AND post_id = p_post_id;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE AddComment(
	IN p_user_id INT,
    IN p_post_id INT,
    IN p_comment TEXT
)
BEGIN
	INSERT INTO comments(
		user_id,
        post_id,
        comment
    )
    VALUES(
		p_user_id,
        p_post_id,
        p_comment
    );
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetComments(
	IN p_post_id INT
)
BEGIN
	SELECT
		comments.id,
        comments.comment,
        comments.created_at,
        
        users.username,
        users.profile_pic
	FROM comments
    INNER JOIN users
    ON comments.user_id = users.id
    WHERE comments.post_id = p_post_id
    ORDER BY comments.created_at DESC;
END $$

DELIMITER ;

DROP PROCEDURE GetPosts;

DELIMITER $$

CREATE PROCEDURE GetPosts(
	IN p_user_id INT
)
BEGIN
	SELECT
		posts.id,
        posts.caption,
        posts.image,
        posts.created_at,
        
        users.id AS user_id,
        users.username,
        users.profile_pic,
        
        (
			SELECT COUNT(*)
            FROM likes
            WHERE likes.post_id = posts.id
        ) AS likesCount,
        
        (
			SELECT COUNT(*)
            FROM comments
            WHERE comments.post_id = posts.id
        ) AS commentsCount,
        
        EXISTS(
			SELECT * FROM likes
            WHERE likes.post_id = posts.id
            AND likes.user_id = p_user_id
        ) AS isLiked
        FROM posts
        
        INNER JOIN users
        ON posts.user_id = users.id
        
        ORDER BY posts.created_at DESC;
END $$

DELIMITER ;

CREATE TABLE followers (
	id INT PRIMARY KEY AUTO_INCREMENT,
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (follower_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (following_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    UNIQUE(follower_id, following_id)
);

ALTER TABLE users
ADD COLUMN bio TEXT,
ADD COLUMN profile_pic TEXT;

DELIMITER $$

CREATE PROCEDURE FollowUser(
	IN p_follower_id INT,
    IN p_following_id INT
)
BEGIN
	INSERT INTO followers(
        follower_id,
        following_id
    )
    VALUES(
        p_follower_id,
        p_following_id
    );
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UnfollowUser(
    IN p_follower_id INT,
    IN p_following_id INT
)
BEGIN
    DELETE FROM followers
    WHERE follower_id = p_follower_id
    AND following_id = p_following_id;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetUserProfile(
	IN p_profile_id INT,
    IN p_logged_in_user INT
)
BEGIN
	SELECT
		users.id,
        users.username,
        users.email,
        users.bio,
        users.profile_pic,
        
        (
			SELECT COUNT(*)
            FROM followers
            WHERE following_id = users.id
        ) AS followersCount,
        (
			SELECT COUNT(*)
            FROM followers
            WHERE follower_id = users.id
        ) AS followingCount,
        (
			SELECT COUNT(*)
            FROM posts
            WHERE posts.user_id = users.id
        ) AS postsCount,
        
        EXISTS(
			SELECT * FROM followers
            WHERE follower_id = p_logged_in_user
            AND following_id = users.id
        ) AS isFollowing
        
        FROM users
        WHERE users.id = p_profile_pic;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetUserProfile(

    IN p_profile_id INT,
    IN p_logged_in_user INT

)
BEGIN

    SELECT

        users.id,
        users.username,
        users.email,
        users.bio,
        users.profile_pic,

        (
            SELECT COUNT(*)
            FROM followers
            WHERE following_id = users.id
        ) AS followersCount,

        (
            SELECT COUNT(*)
            FROM followers
            WHERE follower_id = users.id
        ) AS followingCount,

        (
            SELECT COUNT(*)
            FROM posts
            WHERE posts.user_id = users.id
        ) AS postsCount,

        EXISTS(

            SELECT 1
            FROM followers

            WHERE follower_id = p_logged_in_user
            AND following_id = users.id

        ) AS isFollowing

    FROM users

    WHERE users.id = p_profile_id;

END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetUserPosts(
	IN p_user_id INT
)
BEGIN
	SELECT * FROM posts
    WHERE user_id = p_user_id
    ORDER BY created_at DESC;
END $$

DELIMITER ;

DELIMITER $$
	
CREATE PROCEDURE UpdateProfile(
	IN p_user_id INT,
    IN p_bio TEXT,
    IN p_profile_pic TEXT
)
BEGIN
	UPDATE users
    SET
		bio = p_bio,
        profile_pic = IFNULL(
			p_profile_pic,
            profile_pic
        )
	WHERE id = p_user_id;
END $$
    
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE SearchUsers(
	IN p_search VARCHAR(255)
)
BEGIN
	SELECT 
		id,
        username,
        profile_pic
	FROM users
    WHERE username LIKE CONCAT('%', p_search, '%')
    LIMIT 5;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetSuggestedUsers(
	IN p_logged_in_user INT
)
BEGIN
	SELECT
		id,
        username,
        profile_pic
	FROM users
    WHERE id != p_logged_in_user
    AND id NOT IN(
		SELECT following_id
        FROM followers
        WHERE follower_id = p_logged_in_user
    )
    ORDER BY RAND()
    LIMIT 3;
END $$

DELIMITER ;
        
















