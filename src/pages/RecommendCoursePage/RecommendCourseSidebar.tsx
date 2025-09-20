import { RecommendCourseSidebarProps } from "./type";

export const RecommendCourseSidebar = ({ setIsPlace }: RecommendCourseSidebarProps) => {
  return (
    <div>
      <h1>RecommendCourseSidebar</h1>
      <button onClick={() => setIsPlace(true)}>장소 추천받기</button>
    </div>
  );
};