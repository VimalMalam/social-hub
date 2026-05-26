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

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProfile();
        fetchPosts();
    }, [id]);

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

    if (!profile) return <p className="text-3xl font-bold text-center mt-10">Loading...</p>;

    return (
        <MainLayout>

            <div className="bg-white border border-gray-200 rounded-[24px] sm:rounded-[28px] md:rounded-[36px] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

                {/* PROFILE SECTION */}
                <div className="p-4 sm:p-6 md:p-8 lg:p-10">

                    <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">

                        {/* PROFILE IMAGE */}
                        <div className="flex justify-center xl:justify-start shrink-0">

                            <img
                                src={
                                    profile.profile_pic ||
                                    "https://i.pravatar.cc/150"
                                }
                                alt=""
                                className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 xl:w-40 xl:h-40 rounded-full object-cover ring-4 ring-gray-100 shadow-sm"
                            />

                        </div>


                        {/* PROFILE INFO */}
                        <div className="flex-1 min-w-0">

                            {/* USERNAME + BUTTONS */}
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-8">

                                <div className="text-center lg:text-left min-w-0">

                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-words">

                                        {profile.username}

                                    </h2>

                                </div>


                                {/* ACTION BUTTONS */}
                                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

                                    {
                                        Number(user.id) === Number(profile.id) ? (

                                            <button
                                                onClick={() => setShowEdit(true)}
                                                className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 w-full sm:w-auto"
                                            >
                                                Edit Profile
                                            </button>

                                        ) : (

                                            <button
                                                onClick={handleFollow}
                                                className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 w-full sm:w-auto"
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
                                                className="bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-2xl font-medium transition-all duration-300 w-full sm:w-auto"
                                            >
                                                <MessageCircle />
                                            </button>

                                        )
                                    }

                                </div>

                            </div>


                            {/* STATS */}
                            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-8">

                                <div className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 text-center">

                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">

                                        {profile.postsCount}

                                    </h3>

                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                                        Posts
                                    </p>

                                </div>


                                <div className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 text-center">

                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">

                                        {profile.followersCount}

                                    </h3>

                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                                        Followers
                                    </p>

                                </div>


                                <div className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 text-center">

                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">

                                        {profile.followingCount}

                                    </h3>

                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                                        Following
                                    </p>

                                </div>

                            </div>


                            {/* BIO */}
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5">

                                <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed whitespace-pre-line break-words">

                                    {profile.bio || "No bio"}

                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* POSTS SECTION */}
                <div className="border-t border-gray-100 p-4 sm:p-6 md:p-8">

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">

                        {
                            posts.map((post) => (

                                <div
                                    key={post.id}
                                    className="group overflow-hidden rounded-[18px] sm:rounded-[24px] border border-gray-100 bg-gray-50"
                                >

                                    <img
                                        src={post.image}
                                        alt=""
                                        className="w-full h-44 sm:h-64 md:h-72 lg:h-80 object-cover group-hover:scale-[1.04] transition-all duration-500"
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