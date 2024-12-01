// utils/tokenManager.ts
import authApi from "./authApi";

const TOKEN_REFRESH_INTERVAL = 25 * 60 * 1000; // 25 minutes
const TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes


let refreshTokenTimeout: NodeJS.Timeout;
let inactivityTimeout: NodeJS.Timeout;

const isTokenValid = () => {
  const tokenTimestamp = localStorage.getItem("tokenTimestamp");
  if (!tokenTimestamp) return false;

  const currentTime = Date.now();
  const tokenAge = currentTime - parseInt(tokenTimestamp, 10);

  return tokenAge < TOKEN_EXPIRY;
};

export const startTokenRefreshTimer = () => {
  clearTimeout(refreshTokenTimeout);


  refreshTokenTimeout = setTimeout(async () => {
    try {
      // Check if token is still valid
      if (!isTokenValid()) {
        handleLogout();
        return;
      }

      const response = await authApi.post("/api/auth/refresh-token");
      const {token} = response.data;

      if (token) {
        // Update token and timestamp
        localStorage.setItem("token", token);
        localStorage.setItem("tokenTimestamp", Date.now().toString());

        // Restart the timer
        startTokenRefreshTimer();
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
    console.log("Inactivity timeout triggered");
    handleLogout();
  }, INACTIVITY_TIMEOUT);
};

export const resetTimers = () => {
  startTokenRefreshTimer();
  startInactivityTimer();
};

export const handleLogout = () => {
  console.log("Logging out due to inactivity or token expiry");

  // Clear timeouts
  clearTimeout(refreshTokenTimeout);
  clearTimeout(inactivityTimeout);

  // Remove tokens and user data
  localStorage.removeItem("token");
  localStorage.removeItem("tokenTimestamp");
  localStorage.removeItem("userData");

  // Remove from cookies if used
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Redirect to login
  window.location.href = "/signin";
};

export const initializeTokenManagement = () => {
  const token = localStorage.getItem("token");

  if (token) {
    // Check if token is still valid
    if (!isTokenValid()) {
      handleLogout();
      return;
    }

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

  const trackUserActivity = () => {
    // Reset timers on user activity
    resetTimers();
  };

  events.forEach((event) => {
    window.addEventListener(event, trackUserActivity);
  });

  // Initial timer setup
  resetTimers();

  // Return cleanup function
  return () => {
    events.forEach((event) => {
      window.removeEventListener(event, trackUserActivity);
    });

    clearTimeout(refreshTokenTimeout);
    clearTimeout(inactivityTimeout);
  };
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