import { useEffect, useState } from "react";
import API from "../../api/axios.js";

const CommentModal = ({ postId, onClose, fetchPosts }) => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");

    const fetchComments = async () => {
        try {
            const res = await API.get(`/posts/comments/${postId}`);

            setComments(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchComments();
    }, []);

    const handleComment = async () => {
        try {
            if (!commentText.trim()) return;

            await API.post("/posts/comment", { postId, comment: commentText });

            // CLEAR INPUT
            setCommentText("");

            // REFRESH COMMENTS
            fetchComments();

            // REFRESH POSTS
            fetchPosts();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">

            <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-[0_20px_80px_rgba(0,0,0,0.18)] overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

                    <h2 className="text-2xl font-bold text-gray-900">
                        Comments
                    </h2>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-2xl hover:bg-gray-100 text-gray-600 hover:text-black transition-all duration-300 text-2xl flex items-center justify-center"
                    >
                        ×
                    </button>

                </div>


                {/* COMMENTS */}
                <div className="h-105 overflow-y-auto px-6 py-5 space-y-5">

                    {
                        comments.length > 0 ? (

                            comments.map((item) => (

                                <div
                                    key={item.id}
                                    className="flex gap-4"
                                >

                                    <img
                                        src={
                                            item.profile_pic ||
                                            "https://i.pravatar.cc/150"
                                        }
                                        alt=""
                                        className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
                                    />

                                    <div className="flex-1">

                                        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">

                                            <h3 className="font-semibold text-gray-900 text-[15px] mb-1">

                                                {item.username}

                                            </h3>

                                            <p className="text-gray-700 leading-relaxed text-sm">

                                                {item.comment}

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            ))

                        ) : (

                            <div className="h-full flex items-center justify-center">

                                <p className="text-gray-500 text-sm">

                                    No comments yet

                                </p>

                            </div>

                        )
                    }

                </div>


                {/* INPUT */}
                <div className="border-t border-gray-100 p-5">

                    <div className="flex items-center gap-3">

                        <input
                            type="text"
                            placeholder="Write a comment..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none text-gray-800 placeholder:text-gray-500 focus:border-gray-400 focus:bg-white transition-all duration-300"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />

                        <button
                            onClick={handleComment}
                            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300"
                        >
                            Send
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default CommentModal