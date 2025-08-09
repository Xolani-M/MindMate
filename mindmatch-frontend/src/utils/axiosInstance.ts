import axios from "axios";

// Always use the production backend API regardless of environment
const API_BASE_URL = "https://mindmate-k682.onrender.com";

console.log("API Base URL (Updated):", API_BASE_URL);

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