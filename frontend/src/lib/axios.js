// frontend/src/lib/axios.js
import axios from "axios";

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:3000/api"
  : (import.meta.env.VITE_API_URL || "https://samvaadx-backend.onrender.com") + "/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error("[v0] Response error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error("[v0] Request error:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
      });
    } else {
      console.error("[v0] Axios error:", error.message);
    }
    return Promise.reject(error);
  }
);
