import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                // Try to fetch current user from server (protected route)
                const res = await API.get("/users/me"); // ensure axios has credentials
                const currentUser = res.data;
                setUser(currentUser);
                localStorage.setItem("user", JSON.stringify(currentUser));
            } catch (err) {
                // fallback to localStorage if API call fails (e.g., no cookie/token)
                const stored = localStorage.getItem("user");
                if (stored) setUser(JSON.parse(stored));
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);