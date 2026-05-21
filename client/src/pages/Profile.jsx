import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import MainLayout from "../components/layout/MainLayout";
import API from "../api/axios.js";

const Profile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);

    const fetchProfile = async () => {
        try {
            const res = await API.get(`/users/profile/${id}`);

            setProfile(res.data);
        } catch (error) {
            console.log(error);
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

            <div className="bg-white rounded-2xl p-6 shadow-sm">

                {/* TOP */}
                <div className="flex flex-col md:flex-row gap-10">

                    <img
                        src={
                            profile.profile_pic ||
                            "https://i.pravatar.cc/150"
                        }
                        alt=""
                        className="w-36 h-36 rounded-full object-cover"
                    />


                    <div className="flex-1">

                        <div className="flex items-center gap-5 mb-5">

                            <h2 className="text-3xl font-bold">

                                {profile.username}

                            </h2>


                            <button
                                onClick={handleFollow}
                                className="bg-black text-white px-5 py-2 rounded-xl"
                            >

                                {
                                    profile.isFollowing
                                        ? "Unfollow"
                                        : "Follow"
                                }

                            </button>

                        </div>


                        <div className="flex gap-8 mb-5">

                            <div>

                                <span className="font-bold">

                                    {profile.postsCount}

                                </span>

                                <p>Posts</p>

                            </div>


                            <div>

                                <span className="font-bold">

                                    {profile.followersCount}

                                </span>

                                <p>Followers</p>

                            </div>


                            <div>

                                <span className="font-bold">

                                    {profile.followingCount}

                                </span>

                                <p>Following</p>

                            </div>

                        </div>


                        <p className="text-gray-700">

                            {profile.bio || "No bio"}

                        </p>

                    </div>

                </div>


                {/* POSTS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">

                    {
                        posts.map((post) => (

                            <img
                                key={post.id}
                                src={post.image}
                                alt=""
                                className="w-full h-[300px] object-cover rounded-xl"
                            />

                        ))
                    }

                </div>

            </div>

        </MainLayout>
    )
}

export default Profile