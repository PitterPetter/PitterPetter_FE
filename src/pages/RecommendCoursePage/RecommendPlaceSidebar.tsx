import { RecommendPlaceSidebarProps } from "./type";

export const RecommendPlaceSidebar = ({ setIsPlace }: RecommendPlaceSidebarProps) => {
  return (
    <div>
      <h1>RecommendPlaceSidebar</h1>
      <button onClick={() => setIsPlace(false)}>코스 추천받기</button>
    </div>
  );
};