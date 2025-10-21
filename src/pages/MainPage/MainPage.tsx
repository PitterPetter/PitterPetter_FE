import { MainMapbox } from "../../features/mapbox";
import { useMarkerStore } from "../../shared/store/mapbox.store";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CoupleRoomModal } from "../CoupleRoomPage/CoupleRoomModal";
import { DistrictModal } from "../DistrictPage/DistrictModal";
import { useDistrictStore } from "../../shared/store/district.store";
import { OnboardingPage } from "../OnboardingPage/OnboardingPage";

export const MainPage = () => {
  const { isMarkers } = useMarkerStore();
  const [isCoupleRoom, setIsCoupleRoom] = useState(false);
  const [isDistrict, setIsDistrict] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDistrict = useDistrictStore((state) => state.selectedDistrict);
  const isOutsideSeoul = Boolean(!selectedDistrict && isMarkers);
  const isLockedDistrict = Boolean(selectedDistrict?.locked);
  const isRecommendDisabled = !isMarkers || isOutsideSeoul || isLockedDistrict;

  useEffect(() => {
    if (location.pathname.includes("/coupleroom")) {
      setIsCoupleRoom(true);
      setIsDistrict(false);
      setIsOnboarding(false);
    } else if (location.pathname.includes("/district")) {
      setIsDistrict(true);
      setIsCoupleRoom(false);
      setIsOnboarding(false);
    } else if (location.pathname.includes("/onboarding")) {
      setIsOnboarding(true);
      setIsCoupleRoom(false);
      setIsDistrict(false);
    } else {
      setIsCoupleRoom(false);
      setIsDistrict(false);
      setIsOnboarding(false);
    }
  }, [location.pathname]);
  
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
    <div className="">
      <MainMapbox />

      <div className="absolute bottom-16 right-[50vw] translate-x-[50%] flex flex-col items-center">
      {selectedDistrict && (
            <div className="flex flex-col items-center gap-1 mb-2">
              <span className="text-sm font-semibold text-gray-800">
                서울시 {selectedDistrict.name}
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
        <button
          type="button"
          onClick={handleRecommend}
          disabled={isRecommendDisabled}
          className={`flex flex-col items-center justify-center active:scale-95 transition-all duration-150 rounded-lg w-48 h-12 text-white text-lg text-center shadow-md ${isRecommendDisabled ? "cursor-not-allowed bg-primary/20" : "bg-third hover:bg-third/90"}`}
          title={(() => {
            if (!isMarkers) return "지도를 클릭해 시작점을 먼저 선택하세요";
            if (isOutsideSeoul) return "서울 내부의 지점을 선택해주세요";
            if (isLockedDistrict) return "잠금 해제 후 이용 가능합니다";
            return "코스 추천을 시작합니다";
          })()}
        >
          코스 추천받기
        </button>

        <div className="mt-3 flex flex-col items-center gap-2 text-center text-xs text-gray-500">
          {!isMarkers && <p>시작점을 클릭해주세요</p>}
          {isOutsideSeoul && <p className="text-red-500">서울 외부 지역은 지원되지 않습니다</p>}
        </div>
      </div>

      {isCoupleRoom && <CoupleRoomModal />}
      {isDistrict && <DistrictModal />}
      {isOnboarding && <OnboardingPage />}
    </div>
  );
};
