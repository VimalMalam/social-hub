import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                // First check if we have stored user and token
                const storedUser = localStorage.getItem("user");
                const storedToken = localStorage.getItem("token");

                if (storedUser && storedToken) {
                    // ✅ Set user from localStorage immediately (don't wait for server)
                    setUser(JSON.parse(storedUser));
                    
                    // ✅ Then try to verify/refresh from server in the background
                    try {
                        const res = await API.get("/users/me");
                        if (res.data && res.data.id) {
                            // Update with fresh data from server
                            setUser(res.data);
                            localStorage.setItem("user", JSON.stringify(res.data));
                        }
                    } catch (serverErr) {
                        console.log("Could not refresh user from server, using stored data");
                        // Keep using stored user data - don't clear it
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.log("Auth check failed:", err);
                setUser(null);
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