import {
    useEffect
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../api/axios";

function CompleteRegister() {

    const location = useLocation();

    const navigate = useNavigate();

    const formData = location.state?.formData;


    useEffect(() => {

        // NO DATA
        if (!formData) {

            toast.error("Invalid registration flow");

            navigate("/register");

            return;
        }


        const registerUser = async () => {

            try {

                const res = await API.post(
                    "/auth/register",
                    formData
                );

                toast.success(res.data.message);

                navigate("/login");

            }
            catch (error) {

                console.log(error);

                toast.error(
                    error.response?.data?.message ||
                    "Registration failed"
                );

                navigate("/register");

            }

        };

        registerUser();

    }, []);


    return (

        <div className="h-screen flex items-center justify-center">

            <h1 className="text-2xl font-bold">
                Creating account...
            </h1>

        </div>

    )

}

export default CompleteRegister