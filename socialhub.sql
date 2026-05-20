USE social_media_app;

SELECT * FROM users;

SELECT * FROM posts;

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


        
















