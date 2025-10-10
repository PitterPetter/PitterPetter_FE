import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { tokenStore } from "../../shared/lib/tokenStore";
import { refreshStore } from "../../shared/lib/refreshStore";

export default function AuthBootstrap() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 리다이렉트 후 쿼리스트링에 토큰을 실어주는 백엔드 대응
    const url = new URL(window.location.href);
    const qs = url.searchParams;

    const access = qs.get("access_token");
    const refresh = qs.get("refresh_token");

    if (!access && !refresh) return;

    if (access) {
      tokenStore.setAccessToken(access);
    }
    if (refresh) {
      refreshStore.set(refresh);
    }

    // 쿼리 제거
    const clean = `${window.location.origin}${location.pathname}`;
    window.history.replaceState(null, "", clean);

    // 필요 시 특정 페이지로 이동
    navigate("/home", { replace: true });
  }, [location.pathname, navigate]);

  return null;
}
