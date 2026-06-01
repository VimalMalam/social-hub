import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import MainLayout from "../components/layout/MainLayout";
import API from "../api/axios.js";
import EditProfileModal from "../components/profile/EditProfileModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [activeTab, setActiveTab] = useState("posts");

    const fetchProfile = async () => {
        try {
            const res = await API.get(`/users/profile/${id}`);

            setProfile(res.data);
        } catch (error) {
            console.log(error);

            if (
                error.response?.status === 404
            ) {

                navigate("/");

            }
        }
    };

    const fetchPosts = async () => {
        try {
            const res = await API.get(`/users/posts/${id}`);

            setPosts(res.data);
        } catch (error) {
            console.log(error);
        }
    };


    const handleFollow = async () => {
        try {
            if (profile.isFollowing) {
                await API.post("/users/unfollow", { followingId: profile.id });
            } else {
                await API.post("/users/follow", { followingId: profile.id });
            }

            fetchProfile();
        } catch (error) {
            console.log(error);
        }
    };

    const handleStartChat = async () => {
        try {
            await API.post("/chat/conversation", { receiverId: profile.id });

            navigate("/messages", { state: { refresh: true } });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProfile();
        fetchPosts();
    }, [id]);

    if (!profile) return <p className="text-3xl font-bold text-center mt-10">Loading...</p>;

    return (
        <MainLayout>

            <div className="bg-white border border-gray-200 rounded-3xl sm:rounded-[28px] md:rounded-[36px] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

                {/* PROFILE SECTION */}
                <div className="p-5 sm:p-7 md:p-10">

                    <div className="flex flex-col xl:flex-row items-center xl:items-start gap-8 xl:gap-12">

                        {/* PROFILE IMAGE */}
                        <div className="shrink-0">

                            <img
                                src={
                                    profile.profile_pic ||
                                    "https://i.pravatar.cc/150"
                                }
                                alt=""
                                className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover ring-[6px] ring-gray-100 shadow-md"
                            />

                        </div>


                        {/* PROFILE INFO */}
                        <div className="flex-1 w-full min-w-0">

                            {/* USERNAME + ACTIONS */}
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                                <div className="flex-1 min-w-0 text-center lg:text-left">

                                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 wrap-break-words leading-tight">

                                        {profile.username}

                                    </h2>

                                </div>


                                {/* ACTION BUTTONS */}
                                <div className="flex items-center justify-center lg:justify-end gap-3 shrink-0 flex-wrap">

                                    {
                                        Number(user.id) === Number(profile.id) ? (

                                            <button
                                                onClick={() => setShowEdit(true)}
                                                className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300"
                                            >
                                                Edit Profile
                                            </button>

                                        ) : (

                                            <button
                                                onClick={handleFollow}
                                                className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300"
                                            >

                                                {
                                                    profile.isFollowing
                                                        ? "Unfollow"
                                                        : "Follow"
                                                }

                                            </button>

                                        )
                                    }


                                    {
                                        user.id !== profile.id && (

                                            <button
                                                onClick={handleStartChat}
                                                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-2xl transition-all duration-300 flex items-center justify-center"
                                            >
                                                <MessageCircle size={20} />
                                            </button>

                                        )
                                    }

                                </div>

                            </div>


                            {/* STATS */}
                            <div className="grid grid-cols-3 gap-3 sm:gap-5 my-8">

                                <div className="bg-linear-to-b from-gray-50 to-white border border-gray-100 rounded-3xl p-4 sm:p-5 text-center">

                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">

                                        {profile.postsCount}

                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Posts
                                    </p>

                                </div>


                                <div className="bg-linear-to-b from-gray-50 to-white border border-gray-100 rounded-3xl p-4 sm:p-5 text-center">

                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">

                                        {profile.followersCount}

                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Followers
                                    </p>

                                </div>


                                <div className="bg-linear-to-b from-gray-50 to-white border border-gray-100 rounded-3xl p-4 sm:p-5 text-center">

                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">

                                        {profile.followingCount}

                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Following
                                    </p>

                                </div>

                            </div>


                            {/* BIO */}
                            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5">

                                <p className="text-[15px] text-gray-700 leading-7 whitespace-pre-line wrap-break-words">

                                    {profile.bio || "No bio"}

                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* POSTS SECTION */}
                <div className="border-t border-gray-100 p-5 sm:p-7 md:p-8">

                    <div className="flex items-center justify-between mb-6">

                        <h3 className="text-xl font-bold text-gray-900">
                            Posts
                        </h3>

                        <span className="text-sm text-gray-500">
                            {posts.length} Posts
                        </span>

                    </div>


                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                        {
                            posts.map((post) => (

                                <div
                                    key={post.id}
                                    className="group overflow-hidden rounded-[26px] border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
                                >

                                    <img
                                        src={post.image}
                                        alt=""
                                        className="w-full h-48 sm:h-72 md:h-80 object-cover group-hover:scale-105 transition-all duration-700"
                                    />

                                </div>

                            ))
                        }

                    </div>

                </div>

            </div>

            {
                showEdit && (

                    <EditProfileModal
                        profile={profile}
                        onClose={() => setShowEdit(false)}
                        refreshProfile={fetchProfile}
                    />

                )
            }

        </MainLayout>
    )
}

export default Profile