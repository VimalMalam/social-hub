import { Home, Search, PlusSquare, Bell, User } from "lucide-react";

const MobileNav = () => {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] md:hidden z-50">

            <div className="bg-white/90 backdrop-blur-2xl border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-3xl px-6 py-4">

                <div className="flex items-center justify-between">

                    {/* HOME */}
                    <button
                        className="flex items-center justify-center w-11 h-11 rounded-2xl text-gray-700 hover:bg-gray-100 transition-all duration-300"
                    >
                        <Home size={22} />
                    </button>

                    {/* SEARCH */}
                    <button
                        className="flex items-center justify-center w-11 h-11 rounded-2xl text-gray-700 hover:bg-gray-100 transition-all duration-300"
                    >
                        <Search size={22} />
                    </button>

                    {/* CREATE */}
                    <button
                        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-900 text-white shadow-lg"
                    >
                        <PlusSquare size={22} />
                    </button>

                    {/* NOTIFICATION */}
                    <button
                        className="flex items-center justify-center w-11 h-11 rounded-2xl text-gray-700 hover:bg-gray-100 transition-all duration-300"
                    >
                        <Bell size={22} />
                    </button>

                    {/* PROFILE */}
                    <button
                        className="flex items-center justify-center w-11 h-11 rounded-2xl text-gray-700 hover:bg-gray-100 transition-all duration-300"
                    >
                        <User size={22} />
                    </button>

                </div>

            </div>

        </div>
    )
}

export default MobileNav