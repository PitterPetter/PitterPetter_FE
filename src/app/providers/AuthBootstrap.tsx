import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { tokenStore } from "../../shared/lib/tokenStore";

export default function AuthBootstrap() {
  const location = useLocation();
  const navigate = useNavigate();
  const lastProcessedToken = useRef<string>('');

  useEffect(() => {
    // 1. URL에서 쿼리 파라미터 추출
    const url = new URL(window.location.href);
    const qs = url.searchParams;

    const access = qs.get("access_token");
    const status = qs.get("user_status");
    const newUser = qs.get("is_new_user");
    const onboardingComplete = qs.get("onboarding_complete");
    const isCoupled = qs.get("is_coupled");

    console.log("[AuthBootstrap] === 로그인 흐름 시작 ===");
    console.log("[AuthBootstrap] access_token:", !!access);
    console.log("[AuthBootstrap] user_status:", status);

    if (!access) {
      console.log("[AuthBootstrap] no access_token, skipping");
      return;
    }

    // 이미 처리한 토큰이면 중복 실행 방지
    if (lastProcessedToken.current === access) {
      console.log("[AuthBootstrap] same token already processed, skipping");
      return;
    }

    // 처리한 토큰 저장 (새로운 토큰은 처리 가능)
    lastProcessedToken.current = access;

    // 2. Access Token 저장 (새 토큰으로 업데이트)
    console.log("[AuthBootstrap] saving new access_token to sessionStorage");
    tokenStore.setAccessToken(access);

    // 3. 쿼리 파라미터 저장
    const queryParams = {
      status,
      newUser,
      onboardingComplete,
      isCoupled,
    };
    sessionStorage.setItem("queryParams", JSON.stringify(queryParams));
    console.log("[AuthBootstrap] queryParams saved:", queryParams);

    // 4. URL에서 쿼리 제거
    const clean = `${window.location.origin}${location.pathname}`;
    window.history.replaceState(null, "", clean);
    console.log("[AuthBootstrap] URL cleaned");

    // 5. 사용자 상태에 따라 리디렉션
    let targetPath = "";
    if (status === "ONBOARDING_REQUIRED") {
      targetPath = "/onboarding";
    } else if (status === "ONBOARDING_COMPLETE") {
      targetPath = "/home/coupleroom";
    } else if (status === "COMPLETED") {
      targetPath = "/home";
    } else {
      targetPath = "/login";
    }
    
    console.log("[AuthBootstrap] navigating to:", targetPath);
    navigate(targetPath);

  }, [location.search, navigate]);

  return null;
}