import { MainMapbox } from "../../features/mapbox";
import { useMarkerStore } from "../../shared/store/mapbox.store";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CoupleRoomModal } from "../CoupleRoomPage/CoupleRoomModal";
import { DistrictModal } from "../DistrictPage/DistrictModal";
import { useDistrictStore } from "../../shared/store/district.store";

export const MainPage = () => {
  const { isMarkers } = useMarkerStore();
  const [isCoupleRoom, setIsCoupleRoom] = useState(false);
  const [isDistrict, setIsDistrict] = useState(false);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDistrict = useDistrictStore((state) => state.selectedDistrict);
  const isOutsideSeoul = Boolean(!selectedDistrict && isMarkers);
  const isLockedDistrict = Boolean(selectedDistrict?.isLocked);
  const isRecommendDisabled = !isMarkers || isOutsideSeoul || isLockedDistrict;

  useEffect(() => {
    if (location.pathname.includes("/coupleroom")) {
      setIsCoupleRoom(true);
      setIsDistrict(false);
    } else if (location.pathname.includes("/district")) {
      setIsDistrict(true);
      setIsCoupleRoom(false);
    } else {
      setIsCoupleRoom(false);
      setIsDistrict(false);
    }
  }, [location.pathname]);
  
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
      <MainMapbox />

      <div className="absolute bottom-16 right-1/2 translate-x-1/2">

      {selectedDistrict && (
            <div className="flex flex-col items-center gap-1 mb-2">
              <span className="text-s font-semibold text-gray-800">
                {selectedDistrict.name}
              </span>
              {isLockedDistrict && (
                <p className="text-[#b45309]">
                  <Link to="/mypage#district-lock" className="underline">
                    잠금 해제
                  </Link>{" "}
                  후 이용 가능합니다
                </p>
              )}
            </div>
          )}
        <div
          onClick={handleRecommend}
          className={`flex flex-col items-center justify-center active:scale-95 transition-all duration-150 rounded-lg w-48 h-12 text-white text-lg text-center shadow-md ${isRecommendDisabled || isLockedDistrict ? `cursor-not-allowed bg-primary/20` : `bg-primary hover:bg-primary cursor-pointer`}`}
          aria-disabled={isRecommendDisabled}
          title={(() => {
            if (!isMarkers) return "지도를 클릭해 시작점을 먼저 선택하세요";
            if (isOutsideSeoul) return "서울 내부의 지점을 선택해주세요";
            if (isLockedDistrict) return "잠금 해제 후 이용 가능합니다";
            return "코스 추천을 시작합니다";
          })()}
        >
          코스 추천받기
        </div>

        <div className="mt-3 flex flex-col items-center gap-2 text-center text-xs text-gray-500">
          {!isMarkers && <p>시작점을 클릭해주세요</p>}
          {isOutsideSeoul && <p className="text-red-500">서울 외부 지역은 지원되지 않습니다</p>}
        </div>
      </div>

      {isCoupleRoom && <CoupleRoomModal />}
      {isDistrict && <DistrictModal />}
    </div>
  );
};
