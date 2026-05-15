import {
    useEffect
} from "react";
import {
    useLocation,
    useNavigate
} from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function CompleteLogin() {

    const location = useLocation();

    const navigate = useNavigate();

    const { setUser } = useAuth();

    const user = location.state?.user;


    useEffect(() => {

        if (user) {

            setUser(user);

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            toast.success("Login successful");

            navigate("/");

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