import { useEffect, useState } from "react"
import API from "../api/axios.js";
import socket from "../socket";
import { data } from "react-router-dom";

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await API.get("/notifications");
            setNotifications(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        socket.on("getNotification", (data) => {
            setNotifications((prev) => [
                { username: "Someone", message: data.message }, ...prev
            ]);
        });
    }, []);

    return (
        <div className="absolute top-14 right-0 w-80 bg-white shadow-2xl rounded-3xl p-4 z-50 border border-gray-100">

            <h1 className="font-bold text-lg mb-4">

                Notifications

            </h1>


            <div className="space-y-3 max-h-96 overflow-y-auto">

                {
                    notifications.map(

                        (

                            notification,
                            index

                        ) => (

                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl"
                            >

                                <img
                                    src={
                                        notification.profile_pic ||
                                        "https://i.pravatar.cc/150"
                                    }
                                    alt=""
                                    className="w-11 h-11 rounded-full object-cover"
                                />


                                <div>

                                    <p className="text-sm">

                                        <span className="font-semibold">

                                            {
                                                notification.username
                                            }

                                        </span>

                                        {" "}

                                        {
                                            notification.message
                                        }

                                    </p>

                                </div>

                            </div>

                        )

                    )
                }

            </div>

        </div>
    )
}

export default NotificationDropdown