import { Profile } from "./Profile";
import { CoupleHome } from "./CoupleHome";

export const MyPage = () => {
  return (
    <div className="h-[calc(100vh-64px)] w-[800px]">
      <Profile />
      <CoupleHome />
    </div>
  );
};