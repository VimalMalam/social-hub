import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import MainLayout from "../components/layout/MainLayout";
import API from "../api/axios.js";
import EditProfileModal from "../components/profile/EditProfileModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

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

    if (!profile) return <p className="text-3xl font-bold text-center mt-10">Loading...</p>;

    return (
        <MainLayout>

            <div className="bg-white border border-gray-200 rounded-4xl p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

                {/* TOP */}
                <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">

                    {/* PROFILE IMAGE */}
                    <div className="flex justify-center md:justify-start">

                        <img
                            src={
                                profile.profile_pic ||
                                "https://i.pravatar.cc/150"
                            }
                            alt=""
                            className="w-36 h-36 rounded-full object-cover ring-4 ring-gray-100 shadow-sm"
                        />

                    </div>


                    {/* PROFILE INFO */}
                    <div className="flex-1">

                        {/* USERNAME + BUTTON */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-7">

                            <div>

                                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">

                                    {profile.username}

                                </h2>

                            </div>

                            {
                                Number(user.id) === Number(profile.id) ? (

                                    <button
                                        onClick={() => setShowEdit(true)}
                                        className="bg-black text-white px-5 py-2 rounded-xl"
                                    >
                                        Edit Profile
                                    </button>

                                ) : (

                                    <button
                                        onClick={handleFollow}
                                        className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 w-full md:w-auto"
                                    >
                                        {
                                            profile.isFollowing
                                                ? "Unfollow"
                                                : "Follow"
                                        }
                                    </button>
                                )
                            }

                        </div>

                        {/* STATS */}
                        <div className="flex items-center gap-10 mb-7">

                            <div>

                                <h3 className="text-2xl font-bold text-gray-900">

                                    {profile.postsCount}

                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Posts
                                </p>

                            </div>


                            <div>

                                <h3 className="text-2xl font-bold text-gray-900">

                                    {profile.followersCount}

                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Followers
                                </p>

                            </div>


                            <div>

                                <h3 className="text-2xl font-bold text-gray-900">

                                    {profile.followingCount}

                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Following
                                </p>

                            </div>

                        </div>


                        {/* BIO */}
                        <div className="max-w-2xl">

                            <p className="text-gray-700 leading-relaxed text-[15px]">

                                {profile.bio || "No bio"}

                            </p>

                        </div>

                    </div>

                </div>


                {/* POSTS GRID */}
                <div className="mt-12">

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                        {
                            posts.map((post) => (

                                <div
                                    key={post.id}
                                    className="overflow-hidden rounded-3xl border border-gray-100 bg-gray-50"
                                >

                                    <img
                                        src={post.image}
                                        alt=""
                                        className="w-full h-72 md:h-80 object-cover hover:scale-[1.03] transition-all duration-500"
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