import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      (error.response.data.message === "Access token expired" ||
        error.response.data.message === "Not authorized, token failed" ||
        error.response.data.message === "Not authorized, no token") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (refreshError: any) {
        toast.error(
          refreshError.response?.data?.message ||
            "Session expired. Please log in again."
        );
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      toast.error(
        error.response?.data?.message || "Unauthorized. Please log in."
      );
      window.location.href = "/login";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
