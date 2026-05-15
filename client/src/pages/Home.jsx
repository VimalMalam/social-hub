import MainLayout from "../components/layout/MainLayout";
import PostCard from "../components/feed/PostCard";

const Home = () => {

    return (

        <MainLayout>

            <div className="space-y-5">

                <PostCard />

                <PostCard />

                <PostCard />

            </div>

        </MainLayout>
    )
}

export default Home