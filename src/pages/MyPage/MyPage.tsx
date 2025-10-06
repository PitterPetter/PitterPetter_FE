import { Profile } from "../../features/mypage/components/Profile";
import { CoupleHome } from "../../features/mypage/components/CoupleHome";
import { PersonalOnboarding } from "../../features/onboarding/PersonalOnboarding";

export const MyPage = () => {
  return (
    <div className="h-[100vh] w-full max-w-[800px]">
      <Profile />
      <PersonalOnboarding />
      <CoupleHome />
    </div>
  );
};