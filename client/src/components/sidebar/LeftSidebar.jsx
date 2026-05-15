import { Home, User, Bookmark, Settings, Users } from 'lucide-react';

const LeftSidebar = () => {

    const menuItems = [
        {
            icon: <Home size={20} />,
            name: "Home",
        },
        {
            icon: <User size={20} />,
            name: "Profile"
        },
        {
            icon: <Users size={20} />,
            name: "Friends"
        },
        {
            icon: <Bookmark size={20} />,
            name: "Saved"
        },
        {
            icon: <Settings size={20} />,
            name: "Settings"
        }
    ];

    return (
        <div className="sticky top-24">

            <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

                <div className="space-y-2">

                    {
                        menuItems.map((item, index) => (

                            <button
                                key={index}
                                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer transition-all duration-300 group"
                            >

                                <div className="text-gray-500 group-hover:text-black transition">
                                    {item.icon}
                                </div>

                                <span className="font-medium text-[15px]">
                                    {item.name}
                                </span>

                            </button>

                        ))
                    }

                </div>

            </div>

        </div>
    )
}

export default LeftSidebar