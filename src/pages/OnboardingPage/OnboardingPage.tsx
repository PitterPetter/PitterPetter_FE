import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PersonalOnboarding } from "../../features/onboarding/PersonalOnboarding";
import { useMutation } from "@tanstack/react-query";
import { onboardingApi } from "../../features/onboarding/api";
import { useOnboardingStore } from "../../shared/store/onboarding.store";
import { toast } from 'react-toastify';
import { LoginMapbox } from "../../features/mapbox";
import { useUIStore } from "../../shared/store/ui.store";
import { Spinner } from "../../shared/ui/spinner";

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { alcoholPreference, activeBound, dateCostPreference, favoriteFoodCategories, atmosphere, answeredCount, setAnsweredCount } = useOnboardingStore();
  const isComplete = answeredCount === 5;
  const progress = Math.min(answeredCount, 5) / 5 * 100;
  const scrollBoxRef = useRef<HTMLDivElement | null>(null);
  const { isMapReady } = useUIStore();

  useEffect(() => {
    const el = scrollBoxRef.current;
    if (!el) return;
    el.scrollTo({
      top:  Math.min(el.scrollHeight, (answeredCount) * 180),
      behavior: "smooth",
    });
  }, [answeredCount]);

  const mutation = useMutation({
    mutationFn: onboardingApi.saveOnboarding,
    onSuccess: (data) => {
      console.log(data);
      toast.success('온보딩 정보가 성공적으로 저장되었습니다.');
      navigate("/coupleroom");
    },
    onError: (error: any) => {
      console.log('error:', error);
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
      favoriteFoodCategories,
      preferredAtmosphere: atmosphere
    });

    console.log('body data: ', {
      alcoholPreference,
      activeBound,
      dateCostPreference: convertCostPreference(dateCostPreference),
      favoriteFoodCategories,
      atmosphere
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gradient-to-r from-rose-100 via-rose-100 to-white backdrop-blur-md md:px-4 md:py-6 sm:items-center sm:px-6 lg:px-10">
      <div className="absolute top-0 left-0 w-full h-[100vh] z-0 flex justify-center items-center overflow-hidden">
        <LoginMapbox />
      </div>
      {isMapReady && (
      <div className="relative w-full max-w-5xl overflow-hidden rounded-none md:rounded-xl bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:rounded-4xl sm:max-h-[calc(100vh-80px)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#fde2e4_0%,_transparent_45%),radial-gradient(circle_at_bottom,_#ffe0f0_0%,_transparent_40%)] opacity-70 pointer-events-none" />
        <div className="relative flex h-full flex-col gap-6 px-5 py-7 sm:px-8 sm:py-10 overflow-hidden">
          {/* 헤더 */}
          <header className="flex flex-col gap-6 text-center">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
              <span className="mx-auto inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
                Step 1 · 나의 데이트 취향
              </span>
              <h1 className="text-xl md:text-3xl font-semibold text-gray-900 sm:text-4xl">
                한층 더 정교한 추천을 위해 취향을 알려주세요
              </h1>
              <p className="text-sm text-gray-500">
                최소 5개의 질문에 답변하면 맞춤형 추천을 바로 확인할 수 있어요.
              </p>
            </div>

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                <span>답변 완료 {answeredCount}/5</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </header>

          {/* 콘텐츠 */}
          <section className="h-full relative flex-1 overflow-hidden bg-white/80 shadow-inner">
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/90 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            <div
              ref={scrollBoxRef}
              className="relative max-h-[530px] overflow-y-auto px-4 py-6 sm:max-h-[500px] sm:px-6 sm:py-8 md:max-h-[500px]"
            >
              <PersonalOnboarding />
            </div>
          </section>

          {/* 액션 영역 */}
          <footer className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-xs text-gray-500">
              모든 답변은 언제든 마이페이지에서 수정할 수 있어요.
            </p>
            <button
              type="button"
              className={`w-full max-w-[220px] transform rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
                isComplete
                  ? "bg-primary hover:bg-primary/80"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
            >
              {mutation.isPending ? "저장하는 중..." : "온보딩 완료하기"}
            </button>
          </footer>
        </div>
      </div>
      )}
      {!isMapReady && (
        <div className="absolute top-0 left-0 w-full h-[100vh] z-10 flex justify-center items-center overflow-hidden">
          
        </div>
      )}
    </div>
  );
};
