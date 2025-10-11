import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { tokenStore } from "../../shared/lib/tokenStore";

export default function AuthBootstrap() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // 이미 처리했다면 중복 실행 방지
    if (hasProcessed.current) {
      console.log("[AuthBootstrap] already processed, skipping");
      return;
    }

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

    // 처리 완료 플래그 설정 (중복 실행 방지)
    hasProcessed.current = true;

    // 2. Access Token 저장
    console.log("[AuthBootstrap] saving access_token to sessionStorage");
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
    } else if (status === "COUPLED") {
      targetPath = "/home";
    } else {
      targetPath = "/home/coupleroom";
    }
    
    console.log("[AuthBootstrap] navigating to:", targetPath);
    navigate(targetPath);

  }, [location.search, navigate]);

  return null;
}