// utils/authApi.ts

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// console.log("API Base URL:", API_BASE_URL);

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

// Request interceptor
authApi.interceptors.request.use(
  (config) => {
    // Check for token in both localStorage and cookies
    let token;

    // Try localStorage first
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }

    // Fallback to checking cookies if available
    if (!token && typeof document !== "undefined") {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("token=")
      );
      if (tokenCookie) {
        token = tokenCookie.split("=")[1];
      }
    }

    console.log("Token in interceptor:", {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      url: config.url,
      method: config.method,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found for request to", config.url);
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
authApi.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log("Response Interceptor Success:", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Detailed error logging
    console.error("Response Interceptor Error:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    // Handle 401 unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("Attempting token refresh");
        // Adjust the refresh token endpoint to match your backend
        const response = await authApi.post("/api/auth/refresh-token");
        const {token} = response.data;

        console.log("Token refreshed successfully");

        localStorage.setItem("token", token);
        authApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return authApi(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Logout user if refresh fails
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
    console.log("Setting auth token");
    localStorage.setItem("token", token);
    authApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    console.log("Removing auth token");
    localStorage.removeItem("token");
    delete authApi.defaults.headers.common["Authorization"];
  }
};

export default authApi;