import axios from "axios";
import {User} from "@/types/user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const getUserProfile = async (token: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
