// context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {User, UserRole} from "@/types/user";
import { getUserProfile } from '@/utils/userUtils'; // Your utility function to fetch user role
import {
  initializeTokenManagement,
  initializeActivityTracking,
  cleanupActivityTracking,
} from "@/utils/tokenManager";
import authApi from '@/utils/authApi';

// Define the shape of the user context
interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  updateUserRole: (role: UserRole) => void;
  logout: () => void;
}

const defaultUser: User = {
  id: "",
  name: "",
  email: "",
  role: null,
  isAuthenticated: false,
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User>(defaultUser);

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authApi.get("/api/auth/me");
          setUser({
            ...response.data,
            isAuthenticated: true,
          });
          initializeActivityTracking(); // Initialize token management
        } catch (error) {
          console.error("Failed to initialize user:", error);
          localStorage.removeItem("token");
          setUser(defaultUser);
        }
      }
    };

    initializeUser();
    return () => cleanupActivityTracking();
  }, []);

  const updateUserRole = (role: UserRole) => {
    setUser((prev) => ({...prev, role}));
  };

  const logout = async () => {
    try {
      await authApi.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(defaultUser);
      window.location.href = "/signin";
    }
  };

  return (
    <UserContext.Provider value={{user, setUser, updateUserRole, logout}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};