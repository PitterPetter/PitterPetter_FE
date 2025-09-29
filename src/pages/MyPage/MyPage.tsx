import { Profile } from "../../features/mypage/components/Profile";
import { CoupleHome } from "../../features/mypage/components/CoupleHome";

export const MyPage = () => {
  return (
    <div className="h-[calc(100vh-64px)] w-[800px]">
      <Profile />
      <CoupleHome />
    </div>
  );
};