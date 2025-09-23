import { Profile } from "./profile";
import { CoupleHome } from "./coupleHome";

export const MyPage = () => {
  return (
    <div className="h-[calc(100vh-64px)] w-[800px]">
      <Profile />
      <CoupleHome />
    </div>
  );
};