import {
    Navigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";


function AdminRoute({ children }) {

    const { user, loading } = useAuth();

    console.log(user);


    // WAIT FOR AUTH
    if (loading) {

        return <h1>Loading...</h1>;

    }


    // NOT LOGGED IN
    if (!user) {

        return <Navigate to="/login" />;

    }


    // NOT ADMIN
    if (user.role !== "admin") {

        return <Navigate to="/" />;

    }


    return children;

}

export default AdminRoute;