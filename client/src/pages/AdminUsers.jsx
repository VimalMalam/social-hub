import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import API from "../api/axios.js";
import MainLayout from "../components/layout/MainLayout.jsx";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await API.get("/admin/users");

            setUsers(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    //DELETE USER
    const handleDelete = async (id) => {
        try {
            const confirmDelete = window.confirm(
                "Delete this user?"
            );

            if (!confirmDelete) return;

            const res = await API.delete(
                `/admin/users/${id}`
            );

            toast.success(
                res.data.message
            );

            fetchUsers();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <MainLayout>

            <div className="bg-white border border-gray-200 rounded-[28px] md:rounded-[32px] p-4 sm:p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

                {/* HEADER */}
                <div className="mb-6 md:mb-8">

                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">

                        Manage Users

                    </h1>

                </div>


                {/* MOBILE + TABLE WRAPPER */}
                <div className="space-y-4">

                    {
                        users.map((user) => (

                            <div
                                key={user.id}
                                className="border border-gray-100 rounded-3xl p-4 sm:p-5 hover:bg-gray-50 transition-all duration-300"
                            >

                                {/* TOP */}
                                <div className="flex items-center justify-between gap-4 mb-5">

                                    <div className="flex items-center gap-4 min-w-0">

                                        <img
                                            src={
                                                user.profile_pic ||
                                                "https://i.pravatar.cc/150"
                                            }
                                            alt=""
                                            className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
                                        />

                                        <div className="min-w-0">

                                            <h2 className="font-semibold text-gray-900 text-[15px] truncate">

                                                {user.username}

                                            </h2>

                                            <p className="text-sm text-gray-500 truncate mt-1">

                                                {user.email}

                                            </p>

                                        </div>

                                    </div>


                                    <span className="px-4 py-1.5 rounded-2xl bg-gray-100 text-gray-700 text-sm font-medium shrink-0">

                                        {user.role}

                                    </span>

                                </div>


                                {/* INFO */}
                                <div className="grid grid-cols-2 gap-4 mb-5">

                                    <div className="bg-gray-50 rounded-2xl p-4">

                                        <p className="text-sm text-gray-500 mb-1">

                                            Posts

                                        </p>

                                        <h3 className="text-lg font-bold text-gray-900">

                                            {user.totalPosts}

                                        </h3>

                                    </div>


                                    <div className="bg-gray-50 rounded-2xl p-4">

                                        <p className="text-sm text-gray-500 mb-1">

                                            Joined

                                        </p>

                                        <h3 className="text-sm font-semibold text-gray-900">

                                            {
                                                new Date(
                                                    user.created_at
                                                ).toLocaleDateString()
                                            }

                                        </h3>

                                    </div>

                                </div>


                                {/* ACTION */}
                                <button
                                    onClick={() =>
                                        handleDelete(user.id)
                                    }
                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-medium transition-all duration-300"
                                >

                                    Delete User

                                </button>

                            </div>

                        ))
                    }

                </div>

            </div>

        </MainLayout>
    )
}

export default AdminUsers