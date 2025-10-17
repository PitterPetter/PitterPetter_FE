import { useAuthStore } from "../../shared/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";
import { tokenStore } from "../../shared/lib/tokenStore";
import { authApi } from "../../features/auth/api";
import { useEffect, useState } from "react";
import { Spinner } from "../../shared/ui/spinner";

const PrivateRoute = ({ permissionLevel }: { permissionLevel: "ONBOARDING_REQUIRED" | "COUPLE_MATCHING_REQUIRED" | "LOCK_REQUIRED" | "COMPLETED" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setPermissionLevel = useAuthStore((state) => state.setPermissionLevel);

  useEffect(() => {
    const checkAuth = async () => {
      const token = tokenStore.getAccessToken();
      
      if (!token) {
        console.log("[PrivateRoute] No token found, redirecting to login");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log("[PrivateRoute] Checking auth status...");
        const response = await authApi.getStatus();
        const userStatus = response.data.status;
        
        console.log("[PrivateRoute] User status:", userStatus);
        
        // permissionLevel 설정
        if (["ONBOARDING_REQUIRED", "COUPLE_MATCHING_REQUIRED", "LOCK_REQUIRED", "COMPLETED"].includes(userStatus)) {
          setPermissionLevel(userStatus as "ONBOARDING_REQUIRED" | "COUPLE_MATCHING_REQUIRED" | "LOCK_REQUIRED" | "COMPLETED");
        }
        
        // 권한 확인
        const hasPermission = userStatus === permissionLevel;
        setIsAuthenticated(hasPermission);
        
        if (!hasPermission) {
          console.log("[PrivateRoute] Permission denied, redirecting to login");
        }
      } catch (error) {
        console.error("[PrivateRoute] Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [permissionLevel, setPermissionLevel]);

  if (isLoading) {
    return <Spinner />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;