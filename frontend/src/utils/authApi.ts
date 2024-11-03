// utils/authApi.ts
import axios from "axios";
import {config} from "./config";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_SERVER_API_URL;
};

const authApi = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Add request interceptor
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await authApi.post("/api/auth/refresh-token");
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("token", token);
    authApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete authApi.defaults.headers.common["Authorization"];
  }
};

export default authApi;