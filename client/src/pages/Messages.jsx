import MainLayout from "../components/layout/MainLayout";
import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";

const Messages = () => {

    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        socket.emit("addUser", user.id);
        socket.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        });
    }, [user]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await API.get(
                    "/chat/conversations"
                );
                setConversations(
                    res.data
                );
            }
            catch (error) {
                console.log(error);
            }
        };

        fetchConversations();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!currentChat) return;

            try {
                const res = await API.get(`/chat/messages/${currentChat.id}`);

                setMessages(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchMessages();
    }, [currentChat])

    return (
        <MainLayout>
            <div className="bg-white rounded-2xl h-[85vh] flex overflow-hidden">
                {/* SIDEBAR */}
                <div className="w-87.5 border-r">
                    <h1 className="text-2xl font-bold p-5">
                        Messages
                    </h1>
                    {
                        conversations.map((conversation) => {
                            const isOnline = onlineUsers.some(
                                (u) =>
                                    u.userId === conversation.userId
                            );
                            return (
                                <div
                                    key={conversation.id}
                                    onClick={() =>
                                        setCurrentChat(conversation)
                                    }
                                    className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                conversation.profile_pic ||
                                                "https://i.pravatar.cc/150"
                                            }
                                            alt=""
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <h2 className="font-semibold">
                                                {conversation.username}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                {
                                                    isOnline
                                                        ? "Online"
                                                        : "Offline"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                {/* CHAT AREA */}
                <div className="flex-1 flex flex-col">
                    {
                        currentChat ? (
                            <>
                                {/* HEADER */}
                                <div className="p-5 border-b flex items-center gap-3">
                                    <img
                                        src={
                                            currentChat.profile_pic ||
                                            "https://i.pravatar.cc/150"
                                        }
                                        alt=""
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <h2 className="font-bold text-lg">
                                        {currentChat.username}
                                    </h2>
                                </div>

                                {/* MESSAGES */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    {
                                        messages.map((message) => (
                                            <div
                                                key={message.id}
                                                ref={scrollRef}
                                                className={`flex ${message.sender_id === user.id
                                                    ? "justify-end"
                                                    : "justify-start"
                                                    }`}
                                            >
                                                <div
                                                    className={`px-4 py-3 rounded-2xl max-w-[300px] ${message.sender_id === user.id
                                                        ? "bg-black text-white"
                                                        : "bg-gray-100"
                                                        }`}
                                                >
                                                    {message.message}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>

                                {/* INPUT */}
                                <div className="p-5 border-t flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Write message..."
                                        className="flex-1 border rounded-xl px-4"
                                        value={text}
                                        onChange={(e) =>
                                            setText(e.target.value)
                                        }
                                    />
                                    <button
                                        className="bg-black text-white px-6 rounded-xl"
                                    >
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <h1 className="text-2xl text-gray-400">
                                    Open a conversation
                                </h1>
                            </div>
                        )
                    }
                </div>
            </div>
        </MainLayout>
    )
}

export default Messages