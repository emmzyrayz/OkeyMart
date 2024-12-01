// context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {User, UserRole} from "@/types/user";
import {
  initializeTokenManagement,
  initializeActivityTracking,
  cleanupActivityTracking,
} from "@/utils/tokenManager";
import authApi from '@/utils/authApi';
import router from 'next/router';

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
   const token = localStorage.getItem("token");
   const storedUserData = localStorage.getItem("userData");

   if (token && storedUserData) {
     const userData = JSON.parse(storedUserData);
     setUser({
       id: userData.id,
       name: userData.name,
       email: userData.email,
       role: userData.role,
       isAuthenticated: true,
     });

     initializeTokenManagement();
     initializeActivityTracking();
   }

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
      localStorage.removeItem("userData");
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