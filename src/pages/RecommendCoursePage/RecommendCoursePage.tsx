import { useState } from "react";
import MapboxRecommendPage from "./MapboxRecommendPage";
import { RecommendCourseSidebar } from "./RecommendCourseSidebar";
import { RecommendPlaceSidebar } from "./RecommendPlaceSidebar";

export const RecommendCoursePage = () => {
  const [isPlace, setIsPlace] = useState(false);

  return (
    <div className="flex h-screen">
      <MapboxRecommendPage />
      <div className="min-w-[420px] z-10">
        {isPlace ? <RecommendPlaceSidebar setIsPlace={setIsPlace} /> : <RecommendCourseSidebar setIsPlace={setIsPlace} />}
      </div>
    </div>  
  );
};