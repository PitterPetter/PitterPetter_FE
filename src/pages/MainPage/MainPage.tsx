import MapboxMainPage from "./MapboxMainPage";
import { useMarkerStore } from "../../shared/store/mapbox.store";
import { Button } from "../../shared/ui/button";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MainPage = () => {
  const { isMarkers } = useMarkerStore();
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  
  // 토큰 없으면 /login 으로 리다이렉트
  // useEffect(() => {
  //   const token = sessionStorage.getItem("accessToken");
  //   if (!token) {
  //     navigate("/login", { replace: true });
  //   }
  // }, [navigate]);

  useEffect(() => {
    if (!clicked) return;
    const id = requestAnimationFrame(() => navigate("/options"));
    return () => cancelAnimationFrame(id);
  }, [clicked, navigate]);

  const handleRecommend = useCallback(() => {
    if (!isMarkers) return;
    setClicked(true);
  }, [isMarkers]);

  return (
    <div className="relative">
      <MapboxMainPage />
      
      <div className="absolute bottom-16 right-1/2 translate-x-1/2">
        <Button
          onClick={handleRecommend}
          disabled={!isMarkers}
          className={!isMarkers ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" : ""}
          aria-disabled={!isMarkers}
          title={isMarkers ? "코스 추천을 시작합니다" : "지도를 클릭해 시작점을 먼저 선택하세요"}
        >
          코스 추천받기
        </Button>

        {!isMarkers && (
          <p className="mt-3 text-xs text-center text-gray-500">
            시작점을 클릭해주세요
          </p>
        )}
      </div>
    </div>
  );
};