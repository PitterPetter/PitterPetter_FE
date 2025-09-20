import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 현재 경로가 루트이고 인증이 필요한 경우에만 리다이렉트
    if (location.pathname === "/" && !isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate, location.pathname]);

  // 간단한 인증 상태 확인 함수 (실제로는 토큰 검증 등을 수행)
  const isAuthenticated = () => {
    // 임시로 false 반환 (실제 인증 로직으로 교체 필요)
    return false;
  };

  return <>{children}</>;
};