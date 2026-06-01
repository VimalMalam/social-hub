import { Heart, MessageCircle, Send, Info, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import 'react'
import API from "../../api/axios.js";
import CommentModal from "./CommentModal.jsx";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const PostCard = ({ post, fetchPosts }) => {

    const [showComments, setShowComments] = useState(false);
    const [liked, setLiked] = useState(post.isLiked);
    const [saved, setSaved] = useState(false);

    const handleLike = async () => {
        try {
            if (liked) {
                await API.post("/posts/unlike", { postId: post.id });
                setLiked(false);
            } else {
                await API.post("/posts/like", { postId: post.id });
                setLiked(true);
            }

            fetchPosts();
        } catch (error) {
            console.log(error);
        }
    };

    const handleReport = async () => {
        try {
            const reason = prompt(
                "Why are you reporting this post?"
            );

            if (!reason) return;

            const res = await API.post(
                `/posts/report/${post.id}`, { reason }
            );

            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSave = async () => {
        try {
            if (saved) {
                await API.post("/saved-posts/unsave", { postId: post.id });
                setSaved(false);
            } else {
                await API.post("/saved-posts/save", { postId: post.id });
                setSaved(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const checkSaved = async () => {
            try {
                const res = await API.get(`/saved-posts/check/${post.id}`);
                setSaved(res.data.saved);
            } catch (error) {
                console.log(error);
            }
        };
        checkSaved();
    }, [post.id]);

    return (
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

            {/* TOP */}
            <div className="flex items-center justify-between px-5 py-4">

                <div className="flex items-center gap-3">

                    <img
                        src={post.profile_pic || "https://i.pravatar.cc/150?img=3"}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                    />

                    <div>

                        <Link
                            to={`/profile/${post.user_id}`}
                            className="font-semibold text-gray-900 text-[15px]"
                        >
                            {post.username}
                        </Link>

                        <p className="text-sm text-gray-500">
                            {new Date(post.created_at).toLocaleString()}
                        </p>

                    </div>

                </div>

                <button
                    onClick={handleReport}
                    className="text-red-500 font-semibold cursor-pointer"
                >

                    <Info size={22} />

                </button>

            </div>

            {/* IMAGE */}
            <div className="overflow-hidden">

                <img
                    src={post.image}
                    alt=""
                    className="w-full h-125 object-cover hover:scale-[1.01] transition duration-500"
                />

            </div>

            {/* ACTIONS */}
            <div className="px-5 py-4">

                <div className="flex items-center gap-5 mb-4">

                    <button className="text-gray-700 hover:text-red-500 transition-all duration-300">
                        <Heart onClick={handleLike} className={`cursor-pointer ${liked ? "fill-red-500 text-red-500" : ""}`} size={22} />
                    </button>

                    <button className="text-gray-700 hover:text-blue-500 transition-all duration-300">
                        <MessageCircle onClick={() => setShowComments(true)} className="cursor-pointer" size={22} />
                    </button>

                    <button className="text-gray-700 hover:text-green-500 transition-all duration-300">
                        <Send className="cursor-pointer" size={22} />
                    </button>

                    <button className="text-gray-700 hover:text-yellow-500 transition-all duration-300 ml-auto" onClick={handleSave}>
                        <Bookmark className={`cursor-pointer ${saved ? "fill-yellow-500 text-yellow-500" : ""}`} size={22} />
                    </button>

                </div>

                <p className="font-semibold text-gray-900 text-sm mb-2">
                    {post.likesCount} likes
                </p>

                <p className="text-gray-700 leading-relaxed text-[15px]">

                    <span className="font-semibold text-black mr-2">
                        {post.username}
                    </span>

                    {post.caption}

                </p>

                <button onClick={() => setShowComments(true)} className="text-gray-500 text-sm">
                    View all {post.commentsCount} comments
                </button>

            </div>

            {
                showComments && (
                    <CommentModal postId={post.id} fetchPosts={fetchPosts} onClose={() => setShowComments(false)} />
                )
            }

        </div>
    )
}

export default PostCard