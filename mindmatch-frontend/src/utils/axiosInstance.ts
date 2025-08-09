import axios from "axios";

/**
 * Base URL for the API endpoints
 * Uses environment variable with fallback to production server
 */
const API_BASE_URL: string = process.env.NEXT_PUBLIC_API || "https://mindmate-k682.onrender.com";

console.log("API Base URL:", API_BASE_URL);
console.log("Environment:", process.env.NODE_ENV);

/**
 * Configured axios instance for API communication
 * Includes base URL and default headers for all requests
 */
export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Request interceptor to automatically add authentication token
 * Retrieves JWT token from session storage and adds to Authorization header
 * 
 * @param config - Axios request configuration object
 * @returns Modified configuration with authorization header if token exists
 */
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token: string | null = sessionStorage.getItem("token");
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
                console.log('🔑 Adding token to request:', {
                    url: config.url,
                    hasToken: !!token,
                    tokenStart: token.substring(0, 20) + '...'
                });
            } else {
                console.log('❌ No token found for request:', config.url);
            }
        }
        return config;
    },
);