import 'react'
import toast from "react-hot-toast";
import API from '../api/axios';
import { useAuth } from "../context/AuthContext";

const Home = () => {

    const { user, setUser } = useAuth();

    const handleLogout = async () => {
        try {
            await API.post("/auth/logout");

            setUser(null);

            localStorage.removeItem("user");

            toast.success("Logged out successfully");
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Failed to logout");
        }
    };
    return (

        <div className="p-10">

            <div className="flex justify-between items-center">

                <h1 className="text-4xl font-bold">
                    Welcome {user?.username}
                </h1>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg"
                >
                    Logout
                </button>

            </div>

        </div>
    )
}

export default Home