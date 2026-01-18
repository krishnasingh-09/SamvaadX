// frontend/src/lib/axios.js
import axios from "axios";

// ALWAYS use env-based backend URL
const API_URL =
  import.meta.env.VITE_BACKEND_URL + "/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ REQUIRED for cookies / auth
});

// Response interceptor (keep this – it’s good)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("[Axios Response Error]", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error("[Axios Request Error]", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
      });
    } else {
      console.error("[Axios Error]", error.message);
    }
    return Promise.reject(error);
  }
);
