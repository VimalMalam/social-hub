import { Link } from "react-router-dom";
import { Search, Bell, MessageCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import 'react'

const Navbar = () => {

    const { user } = useAuth();

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
                    <div className="hidden md:flex items-center w-[350px] bg-gray-100/80 border border-gray-200 rounded-2xl px-4 py-3">

                        <Search
                            size={18}
                            className="text-gray-500"
                        />

                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent outline-none ml-3 w-full text-sm text-gray-700 placeholder:text-gray-500"
                        />

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
                                    "https://i.pravatar.cc/150?img=3"
                                }
                                alt=""
                                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-gray-100"
                            />

                            <span className="hidden md:block font-semibold text-gray-800 text-lg">
                                {user?.username}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Navbar