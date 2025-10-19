import { useAuthStore } from "../../shared/store/auth.store";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { tokenStore } from "../../shared/lib/tokenStore";
import { authApi } from "../../features/auth/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Spinner } from "../../shared/ui/spinner";
import { getRedirectPathByStatus } from "../../shared/utils/authRedirect";

const PrivateRoute = ({ permissionLevel }: { permissionLevel: "ONBOARDING_REQUIRED" | "COUPLE_MATCHING_REQUIRED" | "ROCK_REQUIRED" | "COMPLETED" }) => {
  const storedPermissionLevel = useAuthStore((state) => state.permissionLevel);
  const setPermissionLevel = useAuthStore((state) => state.setPermissionLevel);
  const token = tokenStore.getAccessToken();
  const navigate = useNavigate();
  const location = useLocation();

  const isDevBypassActive =
    import.meta.env.DEV && !token && storedPermissionLevel === permissionLevel;

  // 1. 먼저 저장된 permissionLevel 확인
  const hasStoredPermission = storedPermissionLevel === permissionLevel;
  const needsApiCall = storedPermissionLevel === null || !hasStoredPermission;

  const { data, isLoading, error } = useQuery({
    queryKey: ["authStatus", token],
    queryFn: async () => {
      console.log("[PrivateRoute] Checking auth status...");
      const response = await authApi.getStatus();
      return response.data;
    },
    enabled: !!token && needsApiCall, // 토큰이 있고, 저장된 권한이 없거나 다를 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    retry: false, // API 연결 안되면 재시도 안함
  });

  useEffect(() => {
    if (data?.status) {
      const userStatus = data.status;
      console.log("[PrivateRoute] User status:", userStatus);
      
      // permissionLevel 설정 (저장된 값이 null이거나 다를 때)
      if (["ONBOARDING_REQUIRED", "COUPLE_MATCHING_REQUIRED", "ROCK_REQUIRED", "COMPLETED"].includes(userStatus) && 
          (storedPermissionLevel === null || storedPermissionLevel !== userStatus)) {
        setPermissionLevel(userStatus as "ONBOARDING_REQUIRED" | "COUPLE_MATCHING_REQUIRED" | "ROCK_REQUIRED" | "COMPLETED");
        
        // 상태가 바뀌었을 때 적절한 페이지로 리다이렉트
        const targetPath = getRedirectPathByStatus(userStatus);
        
        if (targetPath && location.pathname !== targetPath) {
          console.log("[PrivateRoute] Status changed, redirecting to:", targetPath);
          navigate(targetPath, { replace: true });
        }
      }
    }
  }, [data, storedPermissionLevel, setPermissionLevel, navigate, location.pathname]);

  if (isDevBypassActive) {
    console.log("[PrivateRoute] Dev bypass active, skipping token requirement");
    return <Outlet />;
  }

  // 토큰이 없으면 로그인 페이지로
  if (!token) {
    console.log("[PrivateRoute] No token found, redirecting to login");
    return <Navigate to="/login" replace />;
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
    return <Navigate to="/login" replace />;
  }

  // API 응답으로 권한 확인
  if (needsApiCall && data) {
    const isAuthenticated = data.status === permissionLevel;
    
    if (!isAuthenticated) {
      // 권한이 다를 때는 적절한 페이지로 리다이렉트
      const targetPath = getRedirectPathByStatus(data.status);
      
      console.log("[PrivateRoute] Permission mismatch, redirecting to:", targetPath);
      return <Navigate to={targetPath} replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
