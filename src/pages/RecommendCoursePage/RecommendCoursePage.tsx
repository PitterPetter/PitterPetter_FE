import { Outlet } from "react-router-dom";
import MapboxRecommendPage from "./MapboxRecommendPage";

export const RecommendCoursePage = () => {
  return (
    <div className="flex">
      <MapboxRecommendPage />
      {/* url에 따라 컴포넌트 변경 */}
      <div className="min-w-[420px] z-10">
        <Outlet />
      </div>
    </div>  
  );
};