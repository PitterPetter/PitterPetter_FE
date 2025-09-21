import MapboxRecommendPage from "./MapboxRecommendPage";
import { RecommendCourseSidebar } from "./RecommendCourseSidebar";
import { RecommendPlaceSidebar } from "./RecommendPlaceSidebar";
import { usePlaceStore } from "../../shared/store/mapbox.store";

export const RecommendCoursePage = () => {
  const { isPlace } = usePlaceStore();

  return (
    <div className="flex">
      <MapboxRecommendPage />
      <div className="min-w-[420px] z-10">
        {isPlace ? <RecommendPlaceSidebar /> : <RecommendCourseSidebar />}
      </div>
    </div>  
  );
};