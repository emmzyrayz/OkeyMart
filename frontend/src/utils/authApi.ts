// utils/authApi.ts

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// console.log("API Base URL:", API_BASE_URL);

const authService = {
  async refreshToken() {
    try {
      console.log("Attempting to refresh token");

      // Get the current token for the refresh request
      const currentToken = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/api/auth/refresh-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const {token, user} = response.data;

      if (!token) {
        throw new Error("No token received in refresh response");
      }

      // Update token in storage
      localStorage.setItem("token", token);

      // Optionally update user data
      if (user) {
        localStorage.setItem("userData", JSON.stringify(user));
      }

      return token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  },
};

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
    const token = localStorage.getItem("token");

    console.log("Request Interceptor Token Check:", {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      url: config.url,
      method: config.method,
    });

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

        // Attempt to refresh the token
        const response = await authApi.post("/api/auth/refresh-token");
        const {token, user} = response.data;

        // Update token in storage
        localStorage.setItem("token", token);

        // Optional: Update user data
        if (user) {
          localStorage.setItem("userData", JSON.stringify(user));
        }

        // Update axios and original request headers
        authApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        originalRequest.headers["Authorization"] = `Bearer ${token}`;

        // Retry the original request
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

    // Optional: Set in cookies for cross-domain support
    document.cookie = `token=${token}; path=/; secure; samesite=strict`;
  } else {
    console.log("Removing auth token");
    localStorage.removeItem("token");
    delete authApi.defaults.headers.common["Authorization"];
    // Clear token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
};

export default authApi;