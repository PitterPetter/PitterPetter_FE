/**
 * 사용자 상태에 따라 적절한 페이지 경로를 반환하는 유틸리티 함수
 */
export const getRedirectPathByStatus = (userStatus: string): string => {
  switch (userStatus) {
    case "ONBOARDING_REQUIRED":
      return "/onboarding";
    case "COUPLE_MATCHING_REQUIRED":
      return "/coupleroom";
    case "ROCK_REQUIRED":
      return "/district/choose";
    case "COMPLETED":
      return "/home";
    default:
      return "/login"; // 알 수 없는 상태일 때는 login으로
  }
};

// 사용자 상태를 확인하고 적절한 페이지로 리다이렉트하는 함수
export const redirectBasedOnStatus = (
  userStatus: string,
  navigate: (path: string, options?: { replace?: boolean }) => void
): void => {
  const targetPath = getRedirectPathByStatus(userStatus);
  navigate(targetPath, { replace: true });
};
