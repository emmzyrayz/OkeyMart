// src/context/AuthContext.tsx
import {createContext, useContext, useEffect, ReactNode} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

interface AuthContextType {
  session: any; // Define a proper type based on your session structure
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {data: session, status} = useSession();
  const router = useRouter();

   useEffect(() => {
        if (status === "loading") return; // Do nothing while loading
        if (!session) {
            router.push("/signin"); // Redirect to sign-in if not logged in
        } else {
            // Check if user exists in the database
            const checkUserExists = async () => {
                const res = await fetch("/api/checkUser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: session.user?.email }),
                });
                const data = await res.json();

                if (!data.exists) {
                    router.push("/signup"); // Redirect to signup if user does not exist
                }
            };
            checkUserExists();
        }
    }, [session, status, router]);

  return (
    <AuthContext.Provider value={{session}}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
