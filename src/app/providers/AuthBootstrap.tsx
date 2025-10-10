import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { tokenStore } from "../../shared/lib/tokenStore";
import { getRedirectPath } from "../../features/auth/api"; // <-- 새로 추가한 함수를 import

export default function AuthBootstrap() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. URL에서 쿼리 파라미터 추출
    const url = new URL(window.location.href);
    const qs = url.searchParams;

    const access = qs.get("access_token");

    console.log("[AuthBootstrap] access_token in query:", !!access);

    if (!access) {
      console.log("[AuthBootstrap] no access_token, skipping");
      return;
    }

    // 2. Access Token 저장
    console.log("[AuthBootstrap] saving access_token to sessionStorage");
    tokenStore.setAccessToken(access);

    // 3. URL에서 쿼리 제거
    const clean = `${window.location.origin}${location.pathname}`;
    window.history.replaceState(null, "", clean);
    
    // 4. [수정된 로직] 백엔드 API를 호출하여 최종 경로를 가져오고 이동
    getRedirectPath()
      .then((redirectUrl) => {
        console.log("[AuthBootstrap] Final redirecting to:", redirectUrl);
        // replace: true를 사용하여 뒤로 가기 버튼으로 로그인 페이지로 돌아가지 않도록 함
        navigate(redirectUrl, { replace: true });
      })
      .catch(() => {
        // API 호출 실패 시 안전하게 /home으로 이동
        navigate("/home", { replace: true });
      });

  }, [location.pathname, navigate]);

  return null;
}