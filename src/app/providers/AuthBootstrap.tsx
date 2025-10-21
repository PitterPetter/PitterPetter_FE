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

    if (!access) {
      return;
    }

    // 이미 처리한 토큰이면 중복 실행 방지
    if (lastProcessedToken.current === access) {
      return;
    }

    // 처리한 토큰 저장 (새로운 토큰은 처리 가능)
    lastProcessedToken.current = access;

    // 2. Access Token 저장 (새 토큰으로 업데이트)
    tokenStore.setAccessToken(access);

    // 3. 쿼리 파라미터 저장
    const queryParams = {
      status,
      newUser,
      onboardingComplete,
      isCoupled,
    };
    sessionStorage.setItem("queryParams", JSON.stringify(queryParams));

    // 4. URL에서 쿼리 제거
    const clean = `${window.location.origin}${location.pathname}`;
    window.history.replaceState(null, "", clean);

    // 5. 사용자 상태에 따라 리디렉션
    let targetPath = "";
    if (status === "ONBOARDING_REQUIRED") {
      targetPath = "/onboarding";
    } else if (status === "COUPLE_MATCHING_REQUIRED") {
      targetPath = "/coupleroom";
    } else if (status === "COMPLETED") {
      targetPath = "/home";
    } else if (status === "ROCK_REQUIRED") {
      targetPath = "/district/choose";
    }
     else {
      targetPath = "/home";
    }
    
    navigate(targetPath);

  }, [location.search, navigate]);

  return null;
}