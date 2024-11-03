// context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {User, UserRole} from "@/types/user";
import { getUserProfile } from '@/utils/userUtils'; // Your utility function to fetch user role
import { initializeTokenManagement } from '@/utils/tokenManager';

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
          const userData = await getUserProfile(token);
          setUser({
            ...userData,
            isAuthenticated: true,
          });
          initializeTokenManagement(); // Initialize token management
        } catch (error) {
          console.error("Failed to initialize user:", error);
          localStorage.removeItem("token");
          setUser(defaultUser);
        }
      }
    };

    initializeUser();
  }, []);

  const updateUserRole = (role: UserRole) => {
    setUser((prev) => ({...prev, role}));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(defaultUser);
  };

  const value = useMemo(() => ({ user, setUser , updateUserRole, logout }), [user]);

  return (
    <UserContext.Provider value={value}>
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