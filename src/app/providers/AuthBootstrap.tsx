import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthBootstrap() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const qs = url.searchParams;

    const access = qs.get("access_token");

    if (!access) return;

    // 저장
    sessionStorage.setItem("accessToken", access);

    // 쿼리 제거
    const clean = `${window.location.origin}${location.pathname}`;
    window.history.replaceState(null, "", clean);

    // (선택) 특정 페이지로 이동하고 싶으면 여기서 navigate()
    navigate("/home", { replace: true });
  }, [location.pathname, navigate]);

  return null;
}
