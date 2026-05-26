import db from "../config/db.js";

// CREATE CONVERSATION
export const createConversation = (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId } = req.body;

        db.query(
            "CALL CreateConversation(?, ?)", [senderId, receiverId], (err) => {
                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message: err.message
                    });
                }

                res.status(200).json({
                    message: "Conversation created"
                });
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json(error);
    }
};

// SEND MESSAGE
export const sendMessage = (req, res) => {
    try {
        const senderId = req.user.id;
        const { conversationId, message } = req.body;

        db.query(
            "CALL SendMessage(?, ?, ?)", [conversationId, senderId, message], (err) => {
                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message: err.message
                    });
                }

                res.status(200).json({
                    message: "Message sent"
                });
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json(error);
    }
};