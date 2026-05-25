import {
    useEffect,
    useState
} from "react";
import API from "../api/axios";
import MainLayout from "../components/layout/MainLayout";
import { Link } from "react-router-dom";

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

            <div className="space-y-6">

                {/* STATS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                    {/* USERS */}
                    <div className="bg-white border border-gray-200 rounded-[28px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300">

                        <h2 className="text-gray-500 text-sm font-medium mb-3">

                            Total Users

                        </h2>

                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">

                            {stats.totalUsers}

                        </h1>

                    </div>


                    {/* POSTS */}
                    <div className="bg-white border border-gray-200 rounded-[28px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.04)] hover:translate-y-[-2px] transition-all duration-300">

                        <h2 className="text-gray-500 text-sm font-medium mb-3">

                            Total Posts

                        </h2>

                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">

                            {stats.totalPosts}

                        </h1>

                    </div>


                    {/* COMMENTS */}
                    <div className="bg-white border border-gray-200 rounded-[28px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.04)] hover:translate-y-[-2px] transition-all duration-300">

                        <h2 className="text-gray-500 text-sm font-medium mb-3">

                            Total Comments

                        </h2>

                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">

                            {stats.totalComments}

                        </h1>

                    </div>


                    {/* FOLLOWERS */}
                    <div className="bg-white border border-gray-200 rounded-[28px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.04)] hover:translate-y-[-2px] transition-all duration-300">

                        <h2 className="text-gray-500 text-sm font-medium mb-3">

                            Total Followers

                        </h2>

                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">

                            {stats.totalFollowers}

                        </h1>

                    </div>

                </div>


                {/* ACTION BUTTON */}
                <div>

                    <Link
                        to="/admin/users"
                        className="inline-flex items-center justify-center bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300"
                    >

                        Manage Users

                    </Link>

                    <Link
                        to="/admin/posts"
                        className="bg-black text-white px-5 py-3 rounded-xl inline-block mt-4 ml-4"
                    >

                        Manage Posts

                    </Link>

                </div>

            </div>

        </MainLayout>

    )

}

export default AdminDashboard;