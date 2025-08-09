import axios from "axios";

// Use environment variable with fallback to production
const API_BASE_URL = process.env.NEXT_PUBLIC_API || "https://mindmate-k682.onrender.com";

console.log("API Base URL:", API_BASE_URL);
console.log("Environment:", process.env.NODE_ENV);

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to always set the latest token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
);