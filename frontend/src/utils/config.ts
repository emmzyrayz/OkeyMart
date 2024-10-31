// utils/config.ts
export const config = {
  apiUrl:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL // Your Render URL
      : "http://localhost:3000",
  apiRoutes: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    profile: "/api/user/profile",
  },
};