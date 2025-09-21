import { usePlaceStore } from "../../shared/store/mapbox.store";

export const RecommendPlaceSidebar = () => {
  const { setIsPlace } = usePlaceStore();
  return (
    <div>
      <h1>RecommendPlaceSidebar</h1>
      <button onClick={() => setIsPlace(false)}>코스 추천받기</button>
    </div>
  );
};