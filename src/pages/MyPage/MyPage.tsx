import { Profile } from "../../features/mypage/components/Profile";
import { CoupleHome } from "../../features/mypage/components/CoupleHome";
import { DistrictLock } from "../../features/district/components/DistrictLock";
import { PersonalOnboarding } from "../../features/onboarding/PersonalOnboarding";
import { useHeaderStore } from "../../shared/store/header.store";
import { useMypageStore } from "../../shared/store/mypage.store";
import { useOnboardingStore } from "../../shared/store/onboarding.store";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { mypageApi } from "../../features/mypage/api";
import { Spinner } from "../../shared/ui/spinner";
import { toast } from 'react-toastify';
import { CostList } from "../../features/onboarding/types";
import { useLocation } from "react-router-dom";

export const MyPage = () => {
  const location = useLocation();
  const isOpen = useHeaderStore((s) => s.isOpen);
  const {
    isProfileLoading, setIsProfileLoading,
    isProfileError, setIsProfileError,
    name, setName, setNickname, setEmail, setBirthdate,
    nickname, birthdate, email,
    setCoupleHomeName,
    setDatingStartDate,
    setPartnerName,
    setPartnerEmail,
    coupleHomeName,
    datingStartDate,
    partnerName,
    partnerEmail,
  } = useMypageStore();
  const {
    setAlcoholPreference, setActiveBound, setDateCostPreference, setFavoriteFoodCategories, setAtmosphere,
    alcoholPreference, activeBound, dateCostPreference, favoriteFoodCategories, atmosphere
   } = useOnboardingStore();

   const convertCostPreference = (cost: string | undefined) => {
    if (!cost) return '';
    
    const costMap: { [key: string]: string } = {
      '1만원 이하': '만원_미만',
      '1 ~ 3만원': '만원_삼만원',
      '3 ~ 5만원': '삼만원_오만원',
      '5 ~ 8만원': '오만원_팔만원',
      '8만원 이상': '팔만원_이상',
      '만원 미만': '1만원_미만',
      '만원_삼만원': '1 ~ 3만원',
      '삼만원_오만원': '3 ~ 5만원',
      '오만원_팔만원': '5 ~ 8만원',
      '팔만원_이상': '8만원 이상',
    };
    return costMap[cost] || cost;
  };

  const formatDate = (value: string) => {
    if (!value) return '미등록';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const { data: mypage } = useQuery({
    queryKey: ['mypage'],
    queryFn: async () => {
      try {
        setIsProfileError(false);
        setIsProfileLoading(true);
        const response = await mypageApi.getMypage();
        console.log(convertCostPreference(response.data.data.dateCostPreference));
        setName(response.data?.data.name);
        setNickname(response.data?.data.nickname);
        setEmail(response.data?.data.email);
        setBirthdate(response.data.data.birthdate);
        setAlcoholPreference(response.data?.data.alcoholPreference);
        setActiveBound(response.data?.data.activeBound);
        setDateCostPreference(convertCostPreference(response.data?.data.dateCostPreference) as CostList);
        setFavoriteFoodCategories(response.data?.data.favoriteFoodCategories);
        setAtmosphere(response.data?.data.preferredAtmosphere);
        setCoupleHomeName(response.data?.data.coupleInfo.coupleHomeName);
        setDatingStartDate(response.data?.data.coupleInfo.datingStartDate);
        setPartnerName(response.data?.data.coupleInfo.partnerName);
        setPartnerEmail(response.data?.data.coupleInfo.partnerEmail);
        return response.data?.data;
      } catch (error) {
        console.error("mypage 불러오기 실패:", error);
        setIsProfileError(true);
        throw error;
      } finally {
        setIsProfileLoading(false);
      }
    },
  });
  
  const putMypage = useMutation({
    mutationFn: (data: {
      nickname: string,
      birthdate: string,
      alcoholPreference: number,
      activeBound: number,
      dateCostPreference: string,
      favoriteFoodCategories: string[],
      atmosphere: string,
      coupleHomeName: string,
      datingStartDate: string,
      partnerName: string,
      partnerEmail: string
    }) => mypageApi.putMypage(data),
    onSuccess: (data) => {
      toast.success("프로필 저장 성공");
    },
    onError: (error) => {
      toast.error("프로필 저장 실패");
      console.error("프로필 저장 실패:", error);
    },
  });

  const handleSubmit = () => {
    putMypage.mutate({
      nickname,
      birthdate,
      alcoholPreference,
      activeBound,
      dateCostPreference: convertCostPreference(dateCostPreference),
      favoriteFoodCategories,
      atmosphere,
      coupleHomeName,
      datingStartDate,
      partnerName,
      partnerEmail
    });
    console.log('body data: ',{nickname, birthdate, alcoholPreference, activeBound, dateCostPreference: convertCostPreference(dateCostPreference), favoriteFoodCategories, atmosphere});
  };

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const handle = requestAnimationFrame(() => {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    return () => cancelAnimationFrame(handle);
  }, [location.hash]);

  const formattedAnniversary = formatDate(datingStartDate);
  const displayedCostPreference = dateCostPreference || '선택되지 않음';
  const displayedAtmosphere = atmosphere || '선택되지 않음';
  const foodSummary = favoriteFoodCategories?.length
    ? favoriteFoodCategories.slice(0, 3).join(', ') + (favoriteFoodCategories.length > 3 ? ' 외' : '')
    : '선택되지 않음';
  const summaryCards = [
    { label: '커플 하우스', value: coupleHomeName || '미등록' },
    { label: '데이트 기념일', value: formattedAnniversary },
    { label: '평균 데이트 비용', value: displayedCostPreference },
    { label: '선호 분위기', value: displayedAtmosphere },
    { label: '음식 취향', value: foodSummary },
  ];

  const greetingName = nickname || name || '커플';
  const partnerLabel = partnerName ? `${partnerName}님과 함께` : '데이터를 채워보세요';

  return (
    <div
      className="
        flex flex-col gap-8 items-center justify-start py-10 bg-primary/5
        w-full h-full min-h-screen
        2xl:px-20 2xl:items-start
        px-0
      ">
      <div className="w-full max-w-[1200px] px-4 2xl:px-0 mx-auto flex flex-col gap-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
          <div className="absolute inset-0 bg-white/30 mix-blend-overlay pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 px-8 py-10">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-primary shadow-sm">
                {email || '프로필'}
              </span>
              <h1 className="mt-4 text-3xl font-semibold text-gray-900">
                {greetingName} 마이페이지
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {partnerLabel}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/60 bg-white/80 px-4 py-3 text-gray-700 shadow-sm">
                <p className="text-xs text-gray-500">데이트 온보딩</p>
                <p className="mt-1 font-medium">{displayedAtmosphere}</p>
              </div>
              <div className="rounded-xl border border-white/60 bg-white/80 px-4 py-3 text-gray-700 shadow-sm">
                <p className="text-xs text-gray-500">기념일</p>
                <p className="mt-1 font-medium">{formattedAnniversary}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.slice(0, 4).map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-primary/10 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-xs font-medium text-primary/80">{label}</p>
              <p className="mt-2 text-sm font-semibold text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 상단 2단 레이아웃 */}
      <div className="flex flex-col 2xl:flex-row gap-8 2xl:gap-4 w-full">
        {/* 왼쪽 섹션 - 개인 온보딩 */}
        <div className={`flex flex-col gap-8 w-full ${isOpen ? "min-w-[720px] max-w-[720px]" : "min-w-[720px] max-w-[720px] 2xl:min-w-[720px] 2xl:max-w-[850px]"}`
        }>
          <div className="p-8 px-2 md:px-0 border border-primary/10 rounded-2xl shadow-sm bg-white/80 backdrop-blur-sm transition-all hover:shadow-md">
            {isProfileLoading && <Spinner />}
            {!isProfileLoading && !isProfileError && (
            <>
              <PersonalOnboarding />
              <div className="flex justify-end mt-12 px-8">
                <div className="bg-third/60 text-white w-[120px] h-[40px] text-center py-2 rounded-md cursor-pointer border border-primary/10 text-gray-500 mt-4 hover:bg-third/80 transition-all duration-300"
                  onClick={handleSubmit}
                >
                  {putMypage.isPending ? '저장하는 중...' : "저장"}
                </div>
              </div>
            </>
            )}
          </div>
        </div>

        {/* 오른쪽 섹션 - 프로필 정보 & 커플 홈 */}
        <div className={`flex flex-col gap-8 w-full ${isOpen ? "min-w-[400px] max-w-[720px]" : "min-w-[720px] max-w-[720px] 2xl:max-w-[850px] 2xl:min-w-[400px]"}`
        }>
          {/* 프로필 카드 */}
          <div className="p-8 border border-primary/10 rounded-2xl shadow-sm bg-white/80 backdrop-blur-sm transition-all hover:shadow-md">
            <Profile />
          </div>
          {/* 커플 홈 섹션 */}
          <div className={`
            flex flex-col justify-center items-center w-full px-2 md:px-0
            2xl:max-h-[600px]
            border border-primary/10 rounded-2xl shadow-sm bg-white/80 
            backdrop-blur-sm p-6 transition-all hover:shadow-md
            ${isOpen ? "min-w-[720px] max-w-[720px] 2xl:max-w-[720px] 2xl:min-w-[400px]" : "min-w-[720px] max-w-[720px] 2xl:max-w-[850px] 2xl:min-w-[400px]"}
          `}>
            <CoupleHome />
          </div>
        </div>
      </div>

      {/* 하단 - 지역구 잠금 시스템 */}
      {/* <div className="w-full">
        <div id="district-lock" className="border border-primary/10 rounded-2xl shadow-sm bg-white/80 backdrop-blur-sm transition-all hover:shadow-md">
          <DistrictLock />
        </div>
      </div> */}
    </div>
  );
};
