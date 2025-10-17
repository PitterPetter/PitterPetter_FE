import { useAuthStore } from "../../shared/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";
import { tokenStore } from "../../shared/lib/tokenStore";
import { authApi } from "../../features/auth/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Spinner } from "../../shared/ui/spinner";

const PrivateRoute = ({ permissionLevel }: { permissionLevel: "ONBOARDING_REQUIRED" | "COUPLE_MATCHING_REQUIRED" | "LOCK_REQUIRED" | "COMPLETED" }) => {
  const { permissionLevel: storedPermissionLevel, setPermissionLevel } = useAuthStore((state) => ({
    permissionLevel: state.permissionLevel,
    setPermissionLevel: state.setPermissionLevel,
  }));
  const token = tokenStore.getAccessToken();

  // 1. 먼저 저장된 permissionLevel 확인
  const hasStoredPermission = storedPermissionLevel === permissionLevel;
  const needsApiCall = !storedPermissionLevel || !hasStoredPermission;

  const { data, isLoading, error } = useQuery({
    queryKey: ["authStatus", token],
    queryFn: async () => {
      console.log("[PrivateRoute] Checking auth status...");
      const response = await authApi.getStatus();
      return response.data;
    },
    enabled: !!token && needsApiCall, // 토큰이 있고, 저장된 권한이 없거나 다를 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    retry: 1,
  });

  useEffect(() => {
    if (data?.status) {
      const userStatus = data.status;
      console.log("[PrivateRoute] User status:", userStatus);
      
      // permissionLevel 설정
      if (["ONBOARDING_REQUIRED", "COUPLE_MATCHING_REQUIRED", "LOCK_REQUIRED", "COMPLETED"].includes(userStatus)) {
        setPermissionLevel(userStatus as "ONBOARDING_REQUIRED" | "COUPLE_MATCHING_REQUIRED" | "LOCK_REQUIRED" | "COMPLETED");
      }
    }
  }, [data, setPermissionLevel]);

  // 토큰이 없으면 로그인 페이지로
  if (!token) {
    console.log("[PrivateRoute] No token found, redirecting to login");
    return <Navigate to="/login" />;
  }

  // 저장된 권한이 있고 일치하면 바로 통과
  if (hasStoredPermission) {
    console.log("[PrivateRoute] Using stored permission, access granted");
    return <Outlet />;
  }

  // API 호출이 필요한 경우에만 로딩 표시
  if (needsApiCall && isLoading) {
    return <Spinner />;
  }

  // API 호출 실패
  if (needsApiCall && error) {
    console.error("[PrivateRoute] Auth check failed:", error);
    return <Navigate to="/login" />;
  }

  // API 응답으로 권한 확인
  if (needsApiCall && data) {
    const isAuthenticated = data.status === permissionLevel;
    
    if (!isAuthenticated) {
      console.log("[PrivateRoute] Permission denied, redirecting to login");
      return <Navigate to="/login" />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;