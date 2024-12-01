// utils/withRoleAuth.tsx
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useUser} from "@/context/userContext/UserContext";
import {UserRole} from "@/types/user";

// Define a more precise type for the component
type ComponentType<P = {}> = React.ComponentType<P>;

export function withRoleAuth<P extends object = {}>(allowedRoles: UserRole[]) {
  return (WrappedComponent: ComponentType<P>) => {
    // Create a new component with the same props type
    const WithRoleAuthComponent: React.FC<P> = (props) => {
      const router = useRouter();
      const {user} = useUser();

      useEffect(() => {
        if (!user.isAuthenticated || !allowedRoles.includes(user.role)) {
          router.push("/signin");
        }
      }, [user, router]);

      if (!user.isAuthenticated || !allowedRoles.includes(user.role)) {
        return null;
      }

      return <WrappedComponent {...props} />;
    };

    // Optional: for better debugging
    WithRoleAuthComponent.displayName = `WithRoleAuth(${
      WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

    return WithRoleAuthComponent;
  };
}

// Example usage
export const SellerDashboard = withRoleAuth(["Seller"])(() => {
  return <div>Seller Dashboard</div>;
});
