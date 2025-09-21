import { usePlaceStore } from "../../shared/store/mapbox.store";

export const RecommendCourseSidebar = () => {
  const { setIsPlace } = usePlaceStore();
  return (
    <div>
      <h1>RecommendCourseSidebar</h1>
      <button onClick={() => setIsPlace(true)}>장소 추천받기</button>
    </div>
  );
};