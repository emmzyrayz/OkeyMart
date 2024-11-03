// utils/tokenManager.ts
import authApi from "./authApi";

const TOKEN_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
const INACTIVITY_TIMEOUT = 35 * 60 * 1000; // 35 minutes


let refreshTokenTimeout: NodeJS.Timeout;
let inactivityTimeout: NodeJS.Timeout;

export const startTokenRefreshTimer = () => {
  clearTimeout(refreshTokenTimeout);
  refreshTokenTimeout = setTimeout(async () => {
    try {
      const response = await authApi.post("/api/auth/refresh-token");
      const newToken = response.data.token;
      if (newToken) {
        localStorage.setItem("token", newToken);
        startTokenRefreshTimer(); // Restart the timer
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      handleLogout();
    }
  }, TOKEN_REFRESH_INTERVAL);
};

export const startInactivityTimer = () => {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    handleLogout();
  }, INACTIVITY_TIMEOUT);
};

export const resetTimers = () => {
  startTokenRefreshTimer();
  startInactivityTimer();
};

const handleLogout = () => {
  clearTimeout(refreshTokenTimeout);
  clearTimeout(inactivityTimeout);
  localStorage.removeItem("token");
  window.location.href = "/signin";
};

export const initializeTokenManagement = () => {
  const token = localStorage.getItem("token");
  if (token) {
    startTokenRefreshTimer();
    startInactivityTimer();
  }
};

// Track user activity
const trackUserActivity = () => {
  resetTimers();
};

// Initialize activity tracking
export const initializeActivityTracking = () => {
  const events = ["mousedown", "keydown", "scroll", "touchstart"];
  events.forEach((event) => {
    window.addEventListener(event, trackUserActivity);
  });
  resetTimers();
};

// Cleanup function
export const cleanupActivityTracking = () => {
  const events = ["mousedown", "keydown", "scroll", "touchstart"];
  events.forEach((event) => {
    window.removeEventListener(event, trackUserActivity);
  });
  clearTimeout(refreshTokenTimeout);
  clearTimeout(inactivityTimeout);
};