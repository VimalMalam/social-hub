import MainLayout from "../components/layout/MainLayout";
import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";
import { data } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Messages = () => {
    const location = useLocation();

    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const scrollRef = useRef();
    const [typing, setTyping] = useState(false);

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
    }, [location.state]);

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

        const markRead = async () => {
            try {
                await API.put("/chat/read", { conversationId: currentChat.id });
            } catch (error) {
                console.log(error);
            }
        }

        if (currentChat) {
            markRead();
            fetchMessages();
        }

    }, [currentChat]);

    const handleSend = async () => {
        if (!text.trim()) return;

        try {
            // SOCKET SEND
            socket.emit(
                "sendMessage",
                {
                    senderId: user.id,
                    receiverId: currentChat.userId,
                    message: text
                }
            );

            // DATABASE SAVE
            await API.post("/chat/message", { conversationId: currentChat.id, message: text });

            // LOCAL UI UPDATE
            setMessages((prev) => [...prev, { id: Date.now() + Math.random(), sender_id: user.id, message: text }]);
            setText("");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const receiverMessage = (data) => {
            setMessages((prev) => [...prev, { id: Date.now(), sender_id: data.senderId, message: data.message }]);
        };

        socket.on("getMessage", receiverMessage);

        return () => {
            socket.off("getMessage", receiverMessage);
        };
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    useEffect(() => {
        socket.on("showTyping", () => {
            setTyping(true);

            setTimeout(() => {
                setTyping(false);
            }, 2000);
        });
    }, []);

    return (
        <MainLayout>

            <div className="bg-white border border-gray-200 rounded-[24px] sm:rounded-[28px] md:rounded-[36px] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.04)] h-[85vh] flex">

                {/* SIDEBAR */}
                <div className={`${currentChat ? "hidden lg:flex" : "flex"} w-full lg:w-[360px] border-r border-gray-100 flex-col bg-white`}>

                    {/* HEADER */}
                    <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">

                            Messages

                        </h1>

                    </div>


                    {/* CONVERSATIONS */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">

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
                                        className={`flex items-center justify-between gap-3 p-3 sm:p-4 rounded-3xl cursor-pointer transition-all duration-300 border ${currentChat?.id === conversation.id
                                            ? "bg-gray-100 border-gray-200"
                                            : "border-transparent hover:bg-gray-50"
                                            }`}
                                    >

                                        <div className="flex items-center gap-4 min-w-0">

                                            {/* PROFILE */}
                                            <div className="relative shrink-0">

                                                <img
                                                    src={
                                                        conversation.profile_pic ||
                                                        "https://i.pravatar.cc/150"
                                                    }
                                                    alt=""
                                                    className="w-13 h-13 rounded-full object-cover"
                                                />

                                                <span
                                                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${isOnline
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                        }`}
                                                />

                                            </div>


                                            {/* USER INFO */}
                                            <div className="min-w-0">

                                                <h2 className="font-semibold text-gray-900 truncate text-[15px]">

                                                    {conversation.username}

                                                </h2>

                                                <p className={`text-sm mt-1 ${isOnline
                                                    ? "text-green-600"
                                                    : "text-gray-500"
                                                    }`}>

                                                    {
                                                        conversation.lastMessage ||
                                                        (
                                                            isOnline
                                                                ? "Online"
                                                                : "Offline"
                                                        )
                                                    }

                                                </p>

                                            </div>

                                            {/* UNREAD BADGE */}
                                            {
                                                conversation.unreadCount > 0 && (

                                                    <div className="bg-black text-white text-xs font-semibold min-w-[24px] h-6 px-2 rounded-full flex items-center justify-center">

                                                        {conversation.unreadCount}

                                                    </div>

                                                )
                                            }

                                        </div>

                                    </div>

                                )
                            })
                        }

                    </div>

                </div>


                {/* CHAT AREA */}
                <div className={`${currentChat ? "flex" : "hidden lg:flex"} flex-1 flex-col bg-white`}>

                    {
                        currentChat ? (

                            <>

                                {/* CHAT HEADER */}
                                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-white">

                                    <div className="flex items-center gap-4 min-w-0">

                                        {/* MOBILE BACK */}
                                        <button
                                            onClick={() => setCurrentChat(null)}
                                            className="lg:hidden bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300"
                                        >
                                            ←
                                        </button>

                                        {/* PROFILE */}
                                        <img
                                            src={
                                                currentChat.profile_pic ||
                                                "https://i.pravatar.cc/150"
                                            }
                                            alt=""
                                            className="w-12 h-12 rounded-full object-cover"
                                        />

                                        {/* NAME */}
                                        <div className="min-w-0">

                                            <h2 className="font-bold text-gray-900 text-lg truncate">

                                                {currentChat.username}

                                            </h2>

                                        </div>

                                    </div>

                                </div>


                                {/* MESSAGES */}
                                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4 bg-gray-50">

                                    {
                                        messages.map((message, index) => (

                                            <div
                                                key={message.id || index}
                                                ref={messages.length - 1 === index ? scrollRef : null}
                                                className={`flex ${message.sender_id === user.id
                                                    ? "justify-end"
                                                    : "justify-start"
                                                    }`}
                                            >

                                                <div
                                                    className={`px-5 py-3 rounded-[24px] max-w-[80%] sm:max-w-[70%] break-words text-[16px] leading-relaxed shadow-sm ${message.sender_id === user.id
                                                        ? "bg-gray-900 text-white rounded-br-md"
                                                        : "bg-white border border-gray-100 text-gray-800 rounded-bl-md"
                                                        }`}
                                                >

                                                    <p>{message.message}</p>

                                                    <p className="text-[11px] mt-1 opacity-70">
                                                        {
                                                            new Date(
                                                                message.created_at ||
                                                                Date.now()
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                }
                                                            )
                                                        }
                                                        {
                                                            message.sender_id === user.id && (
                                                                <p className="text-[10px] opacity-70 mt-1 text-right">
                                                                    {
                                                                        message.is_read
                                                                            ? "Seen"
                                                                            : "Sent"
                                                                    }
                                                                </p>
                                                            )
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        ))
                                    }

                                </div>


                                {/* INPUT */}
                                <div className="p-4 sm:p-5 border-t border-gray-100 bg-white">

                                    <div className="flex items-center gap-3">
                                        {
                                            typing && (
                                                <div className="px-5 py-2 text-sm text-gray-500">
                                                    Typing...
                                                </div>
                                            )
                                        }
                                        <input
                                            type="text"
                                            placeholder="Write message..."
                                            className="flex-1 bg-gray-100 border border-transparent focus:border-gray-300 rounded-2xl px-5 py-3.5 outline-none text-gray-800 placeholder:text-gray-500 transition-all duration-300"
                                            value={text}
                                            onChange={(e) => {
                                                setText(e.target.value);
                                                socket.emit("typing", { senderId: user.id, receiverId: currentChat.userId });
                                            }}
                                        />

                                        <button
                                            onClick={handleSend}
                                            className="bg-gray-900 hover:bg-black text-white px-6 sm:px-7 py-3.5 rounded-2xl font-medium transition-all duration-300 shrink-0"
                                        >

                                            Send

                                        </button>

                                    </div>

                                </div>

                            </>

                        ) : (

                            <div className="hidden lg:flex flex-col items-center justify-center h-full text-center px-6">

                                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6 text-4xl">

                                    💬

                                </div>

                                <h1 className="text-3xl font-bold text-gray-900 mb-3">

                                    Your Messages

                                </h1>

                                <p className="text-gray-500 text-[15px] max-w-sm leading-relaxed">

                                    Select a conversation to start chatting with your friends.

                                </p>

                            </div>

                        )
                    }

                </div>

            </div>

        </MainLayout>
    )
}

export default Messages