import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { tokenStore } from "../../shared/lib/tokenStore";

export default function AuthBootstrap() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 리다이렉트 후 쿼리스트링에서 access_token만 추출
    // refresh_token은 httpOnly 쿠키로 자동 관리됨
    const url = new URL(window.location.href);
    const qs = url.searchParams;

    const access = qs.get("access_token");

    console.log("[AuthBootstrap] access_token in query:", !!access);

    if (!access) {
      console.log("[AuthBootstrap] no access_token, skipping");
      return;
    }

    console.log("[AuthBootstrap] saving access_token to sessionStorage");
    tokenStore.setAccessToken(access);

    // 쿼리 제거
    const clean = `${window.location.origin}${location.pathname}`;
    window.history.replaceState(null, "", clean);

    // 필요 시 특정 페이지로 이동
    navigate("/home", { replace: true });
  }, [location.pathname, navigate]);

  return null;
}
