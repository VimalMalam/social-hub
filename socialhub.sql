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

UPDATE users
SET role = 'admin'
WHERE email = 'adminn123@yopmail.com';

SELECT id, username, role
FROM users;

DELIMITER $$
	
CREATE PROCEDURE GetAdminStats()
BEGIN
	SELECT
		(SELECT COUNT(*) FROM users) AS totalUsers,
        (SELECT COUNT(*) FROM posts) AS totalPosts,
        (SELECT COUNT(*) FROM comments) AS totalComments,
        (SELECT COUNT(*) FROM followers) AS totalFollowers;
END $$
    
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetAllUsersForAdmin()
BEGIN
	SELECT
		u.id,
        u.username,
        u.email,
        u.role,
        u.profile_pic,
        u.created_at,
        
        COUNT(p.id) AS totalPosts
        
	FROM users u

    LEFT JOIN posts p
    ON u.id = p.user_id

    GROUP BY u.id
    
    ORDER BY u.created_at DESC;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE DeleteUserByAdmin(
	IN p_user_id INT
)
BEGIN
	DELETE FROM comments
    WHERE user_id = p_user_id;
    
    DELETE FROM likes
    WHERE user_id = p_user_id;
    
    DELETE FROM followers
    WHERE follower_id = p_user_id
    OR following_id = p_user_id;
    
    DELETE FROM posts
    WHERE user_id = p_user_id;
    
    DELETE FROM users
    WHERE id = p_user_id;
END $$

DELIMITER ;

CREATE TABLE reports (
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    post_id INT,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
    FOREIGN KEY (post_id)
    REFERENCES posts(id)
    ON DELETE CASCADE
);

DELIMITER $$

CREATE PROCEDURE GetAllPostsForAdmin()
BEGIN
	SELECT
		p.id,
        p.caption,
        p.image,
        p.created_at,
        
        u.username,
        u.profile_pic,
        
        COUNT(r.id) AS totalReports
	FROM posts p
    JOIN users u
    ON p.user_id = u.id
    LEFT JOIN reports r
    ON p.id = r.post_id
    GROUP BY p.id
    ORDER BY p.created_at DESC;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE DeletePostByAdmin(
	IN p_post_id INT
)
BEGIN
	DELETE FROM comments
    WHERE post_id = p_post_id;
    
    DELETE FROM likes
    WHERE post_id = p_post_id;
    
    DELETE FROM reports
    WHERE post_id = p_post_id;
    
    DELETE FROM posts
    WHERE id = p_post_id;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE ReportPost(
	IN p_user_id INT,
    IN p_post_id INT,
    IN p_reason TEXT
)
BEGIN
	INSERT INTO reports(
		user_id,
        post_id,
        reason
    )
    VALUES(
		p_user_id,
        p_post_id,
        p_reason
    );
END $$

DELIMITER ;

CREATE TABLE conversations (
	id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT,
    receiver_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
    FOREIGN KEY (receiver_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE messages (
	id INT PRIMARY KEY AUTO_INCREMENT,
    conversation_id INT,
    sender_id INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conversation_id)
    REFERENCES conversations(id)
    ON DELETE CASCADE,

    FOREIGN KEY (sender_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

DELIMITER $$
	
	CREATE PROCEDURE CreateConversation(
		IN p_sender_id INT,
        IN p_receiver_id INT
    )
    BEGIN
		INSERT INTO conversations(
			sender_id,
            receiver_id
        )
        VALUES(
			p_sender_id,
            p_receiver_id
        );
    END $$
    
DELIMITER ;

DROP PROCEDURE IF EXISTS SendMessage;

DELIMITER $$

CREATE PROCEDURE SendMessage(
    IN p_conversation_id INT,
    IN p_sender_id INT,
    IN p_message TEXT
)
BEGIN
    INSERT INTO messages(
        conversation_id,
        sender_id,
        message
    )
    VALUES(
        p_conversation_id,
        p_sender_id,
        p_message
    );
END $$

DELIMITER ;


















