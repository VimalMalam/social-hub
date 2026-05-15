import 'react';
import Navbar from "../navbar/Navbar";
import MobileNav from "../navbar/MobileNav";
import LeftSidebar from "../sidebar/LeftSidebar";
import RightSidebar from "../sidebar/RightSidebar";

const MainLayout = ({ children }) => {

    return (
        <div className="min-h-screen bg-gray-100">

            <Navbar />
            <div className="max-w-7xl mx-auto flex gap-5 px-4 pt-24">

                {/* LEFT SIDEBAR */}
                <div className="hidden lg:block w-[22%]">
                    <LeftSidebar />
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1">
                    {children}
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="hidden xl:block w-[25%]">
                    <RightSidebar />
                </div>

            </div>
            <MobileNav />

        </div>
    )
}

export default MainLayout