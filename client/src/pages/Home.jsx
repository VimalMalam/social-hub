import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import PostCard from "../components/feed/PostCard";
import CreatePost from "../components/feed/CreatePost";
import API from "../api/axios.js";

const Home = () => {

    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const res = await API.get("/posts/all");

            setPosts(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPosts();
    }, []);

    return (

        <MainLayout>

            <div className="space-y-5">

                <CreatePost />

                {
                    posts.map((post) => (

                        <PostCard
                            key={post.id}
                            post={post}
                            fetchPosts={fetchPosts}
                        />

                    ))
                }

            </div>

        </MainLayout>
    )
}

export default Home