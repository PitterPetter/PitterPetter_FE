import MapboxMainPage from "./MapboxMainPage";
import { useMarkerStore } from "../../shared/store/useAuthStore";
import { Button } from "../../shared/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const MainPage = () => {
  const { isMarkers } = useMarkerStore();
  const [isClick, setIsClick] = useState(false);
  const navigation = useNavigate();
  if (isClick) {
    navigation("/options");
  }


  return (
    <div className="relative">
      <MapboxMainPage />
      {isMarkers ?
        <Button className="absolute bottom-28 right-1/2 translate-x-1/2" onClick={() => {setIsClick(true)}}>코스 추천받기</Button>
        :
        <Button className="absolute bottom-28 right-1/2 translate-x-1/2 bg-gray-400 hover:bg-gray-400 cursor-not-allowed">시작점을 클릭해주세요</Button>
      }
    </div>
  );
};