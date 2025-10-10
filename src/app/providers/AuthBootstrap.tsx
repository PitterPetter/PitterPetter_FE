import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { tokenStore } from "../../shared/lib/tokenStore";

export default function AuthBootstrap() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const qs = url.searchParams;
    const access = qs.get("access_token");

    if (!access) return;

    // tokenStore에 저장
    tokenStore.setAccessToken(access);

    // 쿼리 제거
    const clean = `${window.location.origin}${location.pathname}`;
    window.history.replaceState(null, "", clean);

    navigate("/home", { replace: true });
  }, [location.pathname, navigate]);

  return null;
}
