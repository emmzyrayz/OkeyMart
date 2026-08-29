// context/UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {IUser, UserRole, UserStatus, VerificationStatus} from "@/models/user";
import {TokenManager} from "@/utils/middle-utils";
import {EncryptionUtility} from "@/utils/encryption";
import authApi from "@/utils/authApi";
import {useRouter} from "next/navigation";

interface UserContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  register: (userData: RegistrationData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

interface RegistrationData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

// Initialize encryption utility
// Encryption handled via server API calls
const encryptionUtil = null;

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize token manager
  const tokenManager = TokenManager.getInstance();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        try {
          // Verify token
          const decoded = tokenManager.verifyToken(token);
          if (decoded) {
            const parsedUserData = JSON.parse(userData);

            // Verify user status
            if (parsedUserData.status !== UserStatus.Active) {
              await logout();
              return;
            }

            setUser(parsedUserData);
            tokenManager.updateTokenActivity(parsedUserData.id);
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          await logout();
        }
      }
    };

    initializeAuth();
  }, []);

  const register = async (userData: RegistrationData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Encrypt sensitive data
      const encryptedEmail = await encryptData(userData.email);
      const {encryptedData: encryptedPassword, iv: passwordIv} =
        encryptionUtil.encryptRandom(userData.password);

      const encryptedPhone = userData.phone
        ? encryptionUtil.encryptDetermined(userData.phone)
        : undefined;

      const response = await authApi.post("/api/auth/register", {
        email: encryptedEmail,
        password: encryptedPassword,
        passwordIv,
        name: userData.name,
        phone: encryptedPhone,
        role: UserRole.Buyer,
      });

      router.push("/verify-email");
    } catch (error) {
      setError("Registration failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const encryptedEmail = encryptionUtil.encryptDetermined(email);

      const response = await authApi.post("/api/auth/login", {
        email: encryptedEmail,
        password,
      });

      const {token, user: userData} = response.data;

      if (!userData.emailVerification.isVerified) {
        await resendVerification(email);
        router.push("/verify-email");
        return;
      }

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(userData));

        setUser(userData);
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Invalid email or password");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.post("/api/auth/logout");
      tokenManager.revokeToken(user?.id || "");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const verifyEmail = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/api/auth/verify-email", {code});

      if (response.data.user) {
        setUser(response.data.user);
        router.push("/login");
      }
    } catch (error) {
      setError("Invalid verification code");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const encryptedEmail = encryptionUtil.encryptDetermined(email);
      const response = await authApi.post("/api/auth/forgot-password", {
        email: encryptedEmail,
      });

      if (response.data.resetCode) {
        await sendResetPasswordEmail(email, response.data.resetCode);
      }
    } catch (error) {
      setError("Error processing request");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const encryptedEmail = encryptionUtil.encryptDetermined(email);
      const {encryptedData: encryptedPassword, iv: passwordIv} =
        encryptionUtil.encryptRandom(newPassword);

      await authApi.post("/api/auth/reset-password", {
        email: encryptedEmail,
        code,
        password: encryptedPassword,
        passwordIv,
      });

      router.push("/login");
    } catch (error) {
      setError("Password reset failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const encryptedEmail = encryptionUtil.encryptDetermined(email);
      const response = await authApi.post("/api/auth/resend-verification", {
        email: encryptedEmail,
      });

      
    } catch (error) {
      setError("Failed to resend verification email");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerification,
    isLoading,
    error,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;
