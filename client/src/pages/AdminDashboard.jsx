import {
    useEffect,
    useState
} from "react";
import API from "../api/axios";
import MainLayout from "../components/layout/MainLayout";

function AdminDashboard() {

    const [stats, setStats] = useState(null);

    const fetchStats = async () => {

        try {
            const res = await API.get(
                "/admin/stats"
            );

            setStats(res.data);
        }
        catch (error) {
            console.log(error);
        }

    };


    useEffect(() => {
        fetchStats();
    }, []);


    if (!stats) {
        return <h1>Loading...</h1>;
    }


    return (

        <MainLayout>

            <div className="grid grid-cols-4 gap-5">

                {/* USERS */}
                <div className="bg-white rounded-2xl p-6">

                    <h2 className="text-gray-500 mb-2">

                        Total Users

                    </h2>

                    <h1 className="text-4xl font-bold">

                        {stats.totalUsers}

                    </h1>

                </div>


                {/* POSTS */}
                <div className="bg-white rounded-2xl p-6">

                    <h2 className="text-gray-500 mb-2">

                        Total Posts

                    </h2>

                    <h1 className="text-4xl font-bold">

                        {stats.totalPosts}

                    </h1>

                </div>


                {/* COMMENTS */}
                <div className="bg-white rounded-2xl p-6">

                    <h2 className="text-gray-500 mb-2">

                        Total Comments

                    </h2>

                    <h1 className="text-4xl font-bold">

                        {stats.totalComments}

                    </h1>

                </div>


                {/* FOLLOWERS */}
                <div className="bg-white rounded-2xl p-6">

                    <h2 className="text-gray-500 mb-2">

                        Total Followers

                    </h2>

                    <h1 className="text-4xl font-bold">

                        {stats.totalFollowers}

                    </h1>

                </div>

            </div>

        </MainLayout>

    )

}

export default AdminDashboard;