import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, MessageCircle, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from 'react';
import API from "../../api/axios.js";
import toast from "react-hot-toast";

const Navbar = () => {

    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const { user, setUser } = useAuth();

    const searchUsers = async () => {
        try {
            if (!search.trim()) {
                setUsers([]);
                return;
            }
            const res = await API.get(`/users/search?search=${search}`);
            setUsers(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    // LOGOUT FUNCTION
    const handleLogout = async () => {
        try {
            await API.post("/auth/logout");

            // Clear localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Clear user from context
            setUser(null);

            toast.success("Logged out successfully");

            // Redirect to login
            navigate("/login");
        } catch (error) {
            console.log(error);
            toast.error("Logout failed");
        }
    }

    useEffect(() => {
        const delay = setTimeout(() => {
            searchUsers();
        }, 500);

        return () => clearTimeout(delay);
    }, [search]);

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">

            <div className="max-w-7xl mx-auto px-4">

                <div className="h-18 flex items-center justify-between">

                    {/* LOGO */}
                    <Link
                        to="/"
                        className="text-2xl font-bold tracking-tight text-gray-900"
                    >
                        SocialHub
                    </Link>


                    {/* SEARCH */}
                    <div className="hidden relative md:flex items-center w-87.5 bg-gray-100/80 border border-gray-200 rounded-2xl px-4 py-3">

                        <Search
                            size={18}
                            className="text-gray-500"
                        />

                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value) }}
                            className="bg-transparent outline-none ml-3 w-full text-sm text-gray-700 placeholder:text-gray-500"
                        />

                        {
                            users.length > 0 && (
                                <div className="absolute top-14 left-0 bg-white shadow-xl rounded-xl w-full p-3 z-50">
                                    {
                                        users.map((user) => (
                                            <Link
                                                to={`/profile/${user.id}`}
                                                key={user.id}
                                                onClick={() => {
                                                    setSearch("");
                                                    setUsers([]);
                                                }}
                                            >
                                                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl">
                                                    <img
                                                        src={
                                                            user.profile_pic ||
                                                            "https://i.pravatar.cc/150"
                                                        }
                                                        alt=""
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                    <h3 className="font-medium">
                                                        {user.username}
                                                    </h3>
                                                </div>
                                            </Link>
                                        ))
                                    }
                                </div>
                            )
                        }

                    </div>


                    {/* RIGHT */}
                    <div className="flex items-center gap-3">

                        {/* NOTIFICATION */}
                        <button
                            className="w-11 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center text-gray-700"
                        >
                            <Bell size={20} />
                        </button>

                        {/* MESSAGE */}
                        <button
                            className="w-11 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center text-gray-700"
                        >
                            <MessageCircle size={20} />
                        </button>

                        {/* PROFILE */}
                        <div className="flex items-center gap-3 pl-1 cursor-pointer">

                            <img
                                src={
                                    user?.profile_pic ||
                                    "https://i.pravatar.cc/150"
                                }
                                alt=""
                                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-gray-100"
                            />

                            <span className="hidden md:block font-semibold text-gray-800 text-lg">
                                {user?.username}
                            </span>

                            {/* LOGOUT BUTTON */}
                            <button
                                onClick={handleLogout}
                                className="w-11 h-11 rounded-2xl bg-red-100 hover:bg-red-200 transition-all duration-300 flex items-center justify-center text-red-600"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>

                        </div>

                    </div>

                    {/* <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl cursor-pointer"
                    >

                        Logout

                    </button> */}

                </div>

            </div>

        </div>
    )
}

export default Navbar