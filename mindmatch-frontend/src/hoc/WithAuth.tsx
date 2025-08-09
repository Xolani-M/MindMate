"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/providers/authProvider";

interface WithAuthProps {
  allowedRoles?: string[];
}

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { allowedRoles = [] }: WithAuthProps = {}
): React.FC<P> => {
  const ComponentWithAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const { isSuccess, user } = useAuthState();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      // Wait a moment for auth provider to restore session
      const checkAuth = () => {
        const token = sessionStorage.getItem("token");
        const userRole = sessionStorage.getItem("role");

        if (!token || !isSuccess) {
          console.log('No token or not authenticated, redirecting to login');
          router.push("/auth/login");
          setIsChecking(false);
          return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole || "")) {
          console.log('User role not authorized:', userRole, 'Required:', allowedRoles);
          // Redirect based on role
          if (userRole === "Instructor") {
            router.push("/instructor");
          } else if (userRole === "Seeker" || !userRole) {
            router.push("/seeker/dashboard");
          } else {
            router.push("/auth/login");
          }
          setIsChecking(false);
          return;
        }

        console.log('User authorized:', { token: !!token, role: userRole, isSuccess });
        setIsAuthorized(true);
        setIsChecking(false);
      };

      // Add a small delay to allow auth provider to restore session
      const timeoutId = setTimeout(checkAuth, 100);
      
      return () => clearTimeout(timeoutId);
    }, [router, isSuccess, user]);

    // Show loading while checking authentication
    if (isChecking) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading...
        </div>
      );
    }

    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithAuth;
};

export default withAuth;