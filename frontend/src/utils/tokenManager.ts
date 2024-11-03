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
      const response = await authApi.post("/auth/refresh-token");
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
    } catch (error) {
      // If token refresh fails, log out the user
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