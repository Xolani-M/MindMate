"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface WithAuthProps {
  allowedRoles?: string[];
}

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { allowedRoles = [] }: WithAuthProps = {}
): React.FC<P> => {
  const ComponentWithAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const token = sessionStorage.getItem("token");
      const userRole = sessionStorage.getItem("role");

      if (!token) {
        router.push("/login");
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole || "")) {
        if (userRole === "Instructor") {
          router.push("/instructor");
        } else {
          router.push("/student");
        }
        return;
      }

      setIsAuthorized(true);
    }, [router]);

    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithAuth;
};

export default withAuth;