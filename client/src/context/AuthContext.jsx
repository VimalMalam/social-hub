import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    //LOAD USER FROM LOCAL STORAGE
    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(JSON.parse(storedUser));
        }

    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);