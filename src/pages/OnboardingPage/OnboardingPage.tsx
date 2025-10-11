import { useNavigate } from "react-router-dom";
import { PersonalOnboarding } from "../../features/onboarding/PersonalOnboarding";
import { useMutation } from "@tanstack/react-query";
import { onboardingApi } from "../../features/onboarding/api";
import { useOnboardingStore } from "../../shared/store/onboarding.store";
import { toast } from 'react-toastify';

export const OnboardingPage = () => {
  const navigate = useNavigate();

  // API 연결 후에 호출 코드 추가 예정
  const { alcoholPreference, activeBound, dateCostPreference, favoriteFoodCategories, atmosphere } = useOnboardingStore();
  const mutation = useMutation({
    mutationFn: onboardingApi.saveOnboarding,
    onSuccess: (data) => {
      console.log(data);
      toast.success('온보딩 정보가 성공적으로 저장되었습니다.');
      navigate("/home");
    },
    onError: (error: any) => {
      console.log('error:',error);
      toast.error('온보딩 정보 저장 실패');
    }
  });
  const handleSubmit = () => {
    // 백엔드 API 형식에 맞게 데이터 변환
    const convertCostPreference = (cost: string) => {
      const costMap: { [key: string]: string } = {
        '1만원 이하': '만원_미만',
        '1 ~ 3만원': '만원_삼만원',
        '3 ~ 5만원': '삼만원_오만원',
        '5 ~ 8만원': '오만원_팔만원',
        '8만원 이상': '팔만원_이상',
      };
      return costMap[cost];
    };

    mutation.mutate({ 
      alcoholPreference, 
      activeBound, 
      dateCostPreference: convertCostPreference(dateCostPreference),
      favoriteFoodCategories: favoriteFoodCategories,
      preferredAtmosphere: atmosphere
    });
    console.log('body data: ', {alcoholPreference, activeBound, dateCostPreference: convertCostPreference(dateCostPreference), favoriteFoodCategories, atmosphere});
  };
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col gap-4 p-4 pt-0 max-w-[450px] md:max-w-[800px]">
        <div className="h-full p-4 pb-6 flex flex-col gap-4 items-center justify-center">
          {/* 개인 온보딩 */}
          <h1 className="text-2xl">취향을 알려주세요</h1>
          <p className="text-gray-500 pb-8">정보를 입력해 주시면 더 정확한 추천을 해드릴 수 있어요</p>
          <PersonalOnboarding />
          {/* Button - API 연결 후 Post하고 메인 페이지로 이동 추가 예정 */}
          <div className="flex justify-center items-center mt-12">
            <div className="flex justify-center items-center w-[304px] h-[64px] bg-[#FFEDED] text-[#121920] px-4 py-2 rounded-md cursor-pointer"
            onClick={() => {
              handleSubmit();
            }}>
              저장하기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};