import axios from "axios";
import Cookies from "js-cookie";
import { getSession } from "next-auth/react";

export const api = axios.create({
    baseURL: "http://localhost:3002",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const session = await getSession();

    if (session?.accessToken) {

        config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            Cookies.remove("accessToken");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;