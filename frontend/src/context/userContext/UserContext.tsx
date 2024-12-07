// context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {User, UserRole} from "@/types/user";
import {
  initializeTokenManagement,
  initializeActivityTracking,
  cleanupActivityTracking,
  handleLogout,
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
   const tokenTimestamp = localStorage.getItem("tokenTimestamp");
   const storedUserData = localStorage.getItem("userData");

   // Check if token exists and is within valid time
   if (token && tokenTimestamp) {
     const currentTime = Date.now();
     const tokenAge = currentTime - parseInt(tokenTimestamp, 10);

     // Define your token expiry time (e.g., 30 minutes)
     const TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes

     if (tokenAge > TOKEN_EXPIRY) {
       // Token has expired
       handleLogout();
       return;
     }

     if (storedUserData) {
       const userData = JSON.parse(storedUserData);
       setUser({
         id: userData.id,
         name: userData.name,
         email: userData.email,
         role: userData.role,
         isAuthenticated: true,
       });

       initializeTokenManagement();
       const cleanup = initializeActivityTracking();

       // Cleanup function
       return () => {
         cleanup();
         cleanupActivityTracking();
       };
     }
   }

   // Cleanup if no valid token
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
      handleLogout();
      localStorage.removeItem("token");
      localStorage.removeItem("tokenTimestamp");
      localStorage.removeItem("userData");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
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