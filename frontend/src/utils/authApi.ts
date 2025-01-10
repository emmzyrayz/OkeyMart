// utils/authApi.ts

import axios from "axios";
import { handleLogout } from "./tokenManager";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// console.log("API Base URL:", API_BASE_URL);

// Define interfaces for error data and modal
interface ErrorDetails {
  userId?: string;
  reason?: string;
  suspendedAt?: string;
  [key: string]: any;
}

interface ModalProps {
  title: string;
  message: string;
  details?: ErrorDetails;
}

// Placeholder for modal service (you'll need to implement this)
const modalService = {
  show: (props: ModalProps) => {
    // Implementation depends on your modal library or custom modal component
    console.warn('Modal would be shown:', props);
    
    // Example using browser alert (replace with your actual modal implementation)
    alert(`${props.title}\n${props.message}`);
  }
};

// Utility functions for different account status scenarios
function handleAccountSuspended(errorData: { details?: ErrorDetails } = {}) {
  // Show suspension details
  modalService.show({
    title: "Account Suspended",
    message: "Your account has been temporarily suspended.",
    details: errorData.details
  });
  handleLogout();
}

function handleAccountBanned(errorData: { details?: ErrorDetails } = {}) {
  // Show permanent ban details
  modalService.show({
    title: "Account Banned",
    message: "Your account has been permanently banned.",
    details: errorData.details
  });
  handleLogout();
}

function handleAccountInactive(errorData: { details?: ErrorDetails } = {}) {
  // Show account inactivity details
  modalService.show({
    title: "Account Inactive",
    message: "Your account is currently inactive.",
    details: errorData.details
  });
  handleLogout();
}

function handleAccountDisabled(errorData: { details?: ErrorDetails } = {}) {
  // Log the disabled account details
  console.warn('Account Disabled:', errorData);
  
  // Show a specific modal or notification
  modalService.show({
    title: "Account Disabled",
    message: "Your account has been disabled.",
    details: errorData.details
  });
  
  // Logout the user
  handleLogout();
}


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


authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // More comprehensive error handling
    if (error.response?.status === 401) {
      const errorCode = error.response.data?.code;

      console.log("Authentication Error:", {
        code: errorCode,
        message: error.response.data?.message,
        path: originalRequest.url,
      });

      // Different handling based on error code
     switch (errorCode) {
       case "ACCOUNT_SUSPENDED":
         handleAccountSuspended(error.response.data);
         break;
       case "ACCOUNT_BANNED":
         handleAccountBanned(error.response.data);
         break;
       case "ACCOUNT_INACTIVE":
       case "ACCOUNT_INVALID_STATUS":
         handleAccountInactive(error.response.data);
         break;

       // Existing token refresh logic
       case "TOKEN_EXPIRED":
       case "TOKEN_INVALID":
         if (!originalRequest._retry) {
           originalRequest._retry = true;
           try {
             const response = await authApi.post("/api/auth/refresh-token");
             const {token, user} = response.data;

             setAuthToken(token);

             return authApi(originalRequest);
           } catch (refreshError) {
             handleLogout();
             return Promise.reject(refreshError);
           }
         }
         break;

       default:
         handleLogout();
         break;
     }
    }

    return Promise.reject(error);
  }
);

// Utility functions
// Utility functions for different account status scenarios

function showAccountDisabledModal(_details: any) {
  // Implement a user-friendly modal explaining account status
  // You might want to show different messages based on the reason
}


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