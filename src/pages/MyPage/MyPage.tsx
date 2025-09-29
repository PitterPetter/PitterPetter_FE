import { Profile } from "../../features/Mypage/Components/Profile";
import { CoupleHome } from "../../features/Mypage/Components/CoupleHome";

export const MyPage = () => {
  return (
    <div className="h-[calc(100vh-64px)] w-[800px]">
      <Profile />
      <CoupleHome />
    </div>
  );
};