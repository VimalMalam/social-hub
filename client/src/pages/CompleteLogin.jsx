import {
    useEffect
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../api/axios";

import { useAuth } from "../context/AuthContext";

function CompleteLogin() {

    const location = useLocation();

    const navigate = useNavigate();

    const { setUser } = useAuth();

    const user = location.state?.user;


    useEffect(() => {

        const finishLogin = async () => {

            try {

                // FINAL LOGIN
                const res = await API.post(
                    "/auth/complete-login",
                    { user }
                );


                setUser(user);

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );


                toast.success(res.data.message);

                const redirectPath = user?.role === "admin" ? "/admin" : "/";

                navigate(redirectPath);

            }
            catch (error) {

                console.log(error);

                toast.error(
                    error.response?.data?.message ||
                    "Login failed"
                );

                navigate("/login");

            }

        };


        if (user) {

            finishLogin();

        }

    }, []);


    return (

        <div className="h-screen flex items-center justify-center">

            <h1 className="text-2xl font-bold">

                Logging in...

            </h1>

        </div>

    )

}

export default CompleteLogin