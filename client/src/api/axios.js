import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API = axios.create({
    baseURL: "https://social-hub-server.up.railway.app/api",
    withCredentials: true
});

// Add token from localStorage to Authorization header
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors - clear storage and redirect to login
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);

export default API;