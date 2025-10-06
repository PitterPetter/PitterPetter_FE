import { useNavigate } from "react-router-dom";
import { PersonalOnboarding } from "../../features/onboarding/PersonalOnboarding";

export const OnboardingPage = () => {
  const navigate = useNavigate();

  // API 연결 후에 호출 코드 추가 예정

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col gap-4 p-4 pt-0 max-w-[450px] md:max-w-[800px]">
        <div className="h-full p-4 pb-6 flex flex-col gap-4 items-center justify-center">
          {/* 개인 온보딩 */}
          <h1 className="text-2xl">혜준 님의 취향을 알려주세요</h1>
          <p className="text-gray-500 pb-8">정보를 입력해 주시면 더 정확한 추천을 해드릴 수 있어요</p>
          <PersonalOnboarding />
          {/* Button - API 연결 후 Post하고 메인 페이지로 이동 추가 예정 */}
          <div className="flex justify-center items-center mt-12">
            <div className="flex justify-center items-center w-[304px] h-[64px] bg-[#FFEDED] text-[#121920] px-4 py-2 rounded-md cursor-pointer"
            onClick={() => {
              navigate("/home");
            }}>
              저장하기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};