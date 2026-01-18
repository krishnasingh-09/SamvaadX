export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api/auth"
      : import.meta.env.VITE_API_URL,
  withCredentials: true,
});
