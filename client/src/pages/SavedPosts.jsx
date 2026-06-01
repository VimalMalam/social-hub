import { useEffect, useState } from "react";
import API from "../api/axios.js";

import MainLayout from "../components/layout/MainLayout.jsx";
import PostCard from "../components/feed/PostCard.jsx";

const SavedPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const res = await API.get("/saved-posts/all");
                setPosts(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchSavedPosts();
    }, []);

    return (
        <MainLayout>

            <div className="space-y-6">

                {/* HEADER */}
                <div className="bg-white border border-gray-200 rounded-[28px] p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">

                        Saved Posts

                    </h1>

                    <p className="text-gray-500 mt-2 text-sm sm:text-base">

                        All posts you've saved in one place.

                    </p>

                </div>


                {/* POSTS */}
                {
                    posts.length > 0 ? (

                        <div className="space-y-5">

                            {
                                posts.map((post) => (

                                    <PostCard
                                        key={post.id}
                                        post={post}
                                    />

                                ))
                            }

                        </div>

                    ) : (

                        <div className="bg-white border border-gray-200 rounded-[28px] p-10 sm:p-14 text-center shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

                            <div className="flex flex-col items-center justify-center">

                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">

                                    <span className="text-2xl">
                                        🔖
                                    </span>

                                </div>

                                <h2 className="text-xl font-semibold text-gray-900 mb-2">

                                    No Saved Posts

                                </h2>

                                <p className="text-gray-500 max-w-sm">

                                    Posts you save will appear here for quick access later.

                                </p>

                            </div>

                        </div>

                    )
                }

            </div>

        </MainLayout>
    );
}

export default SavedPosts