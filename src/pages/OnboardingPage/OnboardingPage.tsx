import { useNavigate } from "react-router-dom";
import { PersonalOnboarding } from "../../features/onboarding/PersonalOnboarding";
import { useMutation } from "@tanstack/react-query";
import { onboardingApi } from "../../features/onboarding/api";
import { useOnboardingStore } from "../../shared/store/onboarding.store";
import { toast } from 'react-toastify';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { alcoholPreference, activeBound, dateCostPreference, favoriteFoodCategories, atmosphere, answeredCount } = useOnboardingStore();
  const mutation = useMutation({
    mutationFn: onboardingApi.saveOnboarding,
    onSuccess: (data) => {
      console.log(data);
      toast.success('온보딩 정보가 성공적으로 저장되었습니다.');
      navigate("/home/coupleroom");
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
    <div className="w-full flex justify-center items-center bg-primary/80 h-[100vh]">
      <div className="flex flex-col p-0 pt-0 w-full md:max-w-[800px] h-full justify-center items-center">
        <div className="h-full w-full p-4 pb-6 flex flex-col gap-4 items-center justify-center border border-primary/10 bg-white backdrop-blur-sm">
          {/* 개인 온보딩 */}
          <h1 className="text-2xl">본인의 취향을 알려주세요</h1>
          <p className="text-gray-500 pb-8">정보를 입력해 주시면 더 정확한 추천을 해드릴 수 있어요</p>
          <div className="overflow-y-hidden relative">
            <PersonalOnboarding />
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
          </div>
          <div className="flex justify-center items-center mt-12">
            <div className={`flex justify-center items-center w-[304px] h-[64px] bg-primary text-white px-4 py-2 rounded-md
            ${answeredCount===5 ? "opacity-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            onClick={answeredCount === 5 ? handleSubmit : undefined}>
              저장하기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};