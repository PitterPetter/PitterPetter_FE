import { Profile } from "../../features/mypage/components/Profile";
import { CoupleHome } from "../../features/mypage/components/CoupleHome";

export const MyPage = () => {
  return (
    <div className="h-[100vh] w-full max-w-[800px]">
      <Profile />
      <CoupleHome />
    </div>
  );
};