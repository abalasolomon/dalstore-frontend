// axiosConfig.js
import axios from "axios";
import { API_URL } from "../config/apiConfig";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(localStorage.getItem("userInfo"))
    const token = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo")).access
      : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      localStorage.removeItem("userInfo");

      const currentUrl = window.location.pathname + window.location.search;
      window.location.href = `/login?next=${currentUrl}`;
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
export { axiosInstance as axios };
