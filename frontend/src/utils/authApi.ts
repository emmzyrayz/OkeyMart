// utils/api.ts
import axios from "axios";

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    authApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete authApi.defaults.headers.common["Authorization"];
  }
};

export default authApi;
