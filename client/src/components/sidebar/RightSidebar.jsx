import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios.js";

const RightSidebar = () => {

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {

        try {

            const res = await API.get(
                "/users/suggested"
            );

            setUsers(res.data);

        }
        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchUsers();

    }, []);

    return (
        <div className="bg-white border border-gray-200 rounded-[28px] p-5 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

            <h2 className="text-xl font-bold text-gray-900 mb-6">

                Suggested Users

            </h2>


            <div className="space-y">

                {
                    users.map((user) => (

                        <Link
                            to={`/profile/${user.id}`}
                            key={user.id}
                            className="block"
                        >

                            <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300">

                                <img
                                    src={
                                        user.profile_pic ||
                                        "https://i.pravatar.cc/150"
                                    }
                                    alt=""
                                    className="w-13 h-13 rounded-full object-cover ring-2 ring-gray-100"
                                />


                                <div>

                                    <h3 className="font-semibold text-gray-900 text-[15px]">

                                        {user.username}

                                    </h3>

                                </div>

                            </div>

                        </Link>

                    ))
                }

            </div>

        </div>
    )
}

export default RightSidebar