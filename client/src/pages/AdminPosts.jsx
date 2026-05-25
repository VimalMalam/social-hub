import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api/axios.js";
import MainLayout from "../components/layout/MainLayout.jsx";

const AdminPosts = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const res = await API.get("/admin/posts");
            setPosts(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [])

    //DELETE POSTS
    const handleDelete = async (id) => {
        try {
            const confirmDelete = window.confirm("Delete this post?");

            if (!confirmDelete) return;

            const res = await API.delete(`/admin/posts${id}`);

            toast.success(res.data.message);

            fetchPosts();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <MainLayout>

            <div className="bg-white border border-gray-200 rounded-[28px] md:rounded-[32px] p-4 sm:p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

                {/* HEADER */}
                <div className="mb-8">

                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">

                        Manage Posts

                    </h1>

                </div>


                {/* POSTS */}
                <div className="space-y-6">

                    {
                        posts.map((post) => (

                            <div
                                key={post.id}
                                className="bg-gray-50 border border-gray-100 rounded-[28px] p-4 sm:p-5 md:p-6 hover:bg-gray-100/60 transition-all duration-300"
                            >

                                {/* USER */}
                                <div className="flex items-center gap-4 mb-5">

                                    <img
                                        src={
                                            post.profile_pic ||
                                            "https://i.pravatar.cc/150"
                                        }
                                        alt=""
                                        className="w-13 h-13 rounded-full object-cover ring-2 ring-white"
                                    />

                                    <div>

                                        <h2 className="font-semibold text-gray-900 text-[15px]">

                                            {post.username}

                                        </h2>

                                    </div>

                                </div>


                                {/* IMAGE */}
                                <div className="overflow-hidden rounded-[24px]">

                                    <img
                                        src={post.image}
                                        alt=""
                                        className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover hover:scale-[1.02] transition-all duration-500"
                                    />

                                </div>


                                {/* CAPTION */}
                                <p className="mt-5 text-gray-700 leading-relaxed text-[15px]">

                                    {post.caption}

                                </p>


                                {/* REPORTS */}
                                <div className="mt-4 inline-flex items-center px-4 py-2 rounded-2xl bg-red-100 text-red-600 text-sm font-semibold">

                                    Reports: {post.totalReports}

                                </div>


                                {/* DELETE */}
                                <div className="mt-5">

                                    <button
                                        onClick={() =>
                                            handleDelete(post.id)
                                        }
                                        className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300"
                                    >

                                        Delete Post

                                    </button>

                                </div>

                            </div>

                        ))
                    }

                </div>

            </div>

        </MainLayout>
    )
}

export default AdminPosts