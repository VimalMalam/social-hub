import { Heart, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import 'react'
import API from "../../api/axios.js";
import CommentModal from "./CommentModal.jsx";

const PostCard = ({ post, fetchPosts }) => {

    const [showComments, setShowComments] = useState(false);
    const [liked, setLiked] = useState(post.isLiked);

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
    }

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

                        <h3 className="font-semibold text-gray-900 text-[15px]">
                            {post.username}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {new Date(post.created_at).toLocaleString()}
                        </p>

                    </div>

                </div>

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