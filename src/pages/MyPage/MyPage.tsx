import { Profile } from "../../features/mypage/components/Profile";
import { CoupleHome } from "../../features/mypage/components/CoupleHome";
import { DistrictLock } from "../../features/district/components/DistrictLock";
import { PersonalPreferences } from "../../features/mypage/components/PersonalPreferences";
import { useHeaderStore } from "../../shared/store/header.store";
import { useMypageStore } from "../../shared/store/mypage.store";
import { useOnboardingStore } from "../../shared/store/onboarding.store";
import { useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { mypageApi } from "../../features/mypage/api";
import { Spinner } from "../../shared/ui/spinner";
import { toast } from 'react-toastify';
import { CostList } from "../../features/onboarding/types";
import { useLocation, useNavigate } from "react-router-dom";

export const MyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isProfileLoading, setIsProfileLoading,
    isProfileError, setIsProfileError,
    name, setName, setNickname, setEmail, setBirthdate,
    nickname, birthdate, email,
    setCoupleHomeName,
    setDatingStartDate,
    setPartnerName,
    setPartnerEmail,
    setTicket,
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
        console.log(response.data.data);
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
        setTicket(response.data?.data.ticket);
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

  const daysCount = useMemo(() => {
    if (!datingStartDate) return 0;
    const startDate = new Date(datingStartDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [datingStartDate]);

  const formattedAnniversary = formatDate(datingStartDate);
  const displayedCostPreference = dateCostPreference || '선택되지 않음';
  const formattedDaysTogether = daysCount || '미등록';
  const displayedAtmosphere = atmosphere || '선택되지 않음';
  const foodSummary = favoriteFoodCategories?.length
    ? favoriteFoodCategories.slice(0, 3).join(', ') + (favoriteFoodCategories.length > 3 ? ' 외' : '')
    : '선택되지 않음';
  const summaryCards = [
    { label: '커플 이름', value: coupleHomeName || '미등록' },
    { label: '연결된 상대방', value: partnerName || '미등록' },
    { label: '우리가 만난 날', value: formattedAnniversary },
    { label: '우리가 함께한 날', value: formattedDaysTogether }
  ];

  const greetingName = nickname || name || '커플';
  const partnerLabel = partnerName ? `${partnerName}님과 함께` : '데이터를 채워보세요';

  return (
    <>
    {putMypage.isPending || isProfileLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner />
          </div>
        ) :
    <div
      className="
        flex flex-col gap-8 items-center justify-start py-6 md:py-10 bg-primary/5
        w-full h-full min-h-screen
        px-4 lg:px-8 xl:px-12 2xl:px-20
      ">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-6">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
          <div className="absolute inset-0 bg-white/30 mix-blend-overlay pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 px-8 py-10">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-primary shadow-sm">
                {email || '프로필'}
              </span>
              <h1 className="mt-4 text-3xl font-semibold text-gray-900">
                {greetingName} 님의 마이페이지
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {partnerLabel}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (window.confirm('정말 로그아웃하시겠습니까?')) {
                    sessionStorage.clear();
                    navigate("/login");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-label="로그아웃"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
                로그아웃
              </button>
            </div>
          </div>
        </div> 

        <div className="grid w-full gap-4 grid-cols-2 lg:grid-cols-4">
          {summaryCards.slice(0, 4).map(({ label, value }) => (
            <div
              key={label}
              className="border border-primary/10 bg-white/90 p-4 lg:p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-xs font-medium text-primary/80">{label}</p>
              <p className="mt-2 text-sm font-semibold text-gray-800 truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 레이아웃 */}
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
          {/* 왼쪽 섹션 - 개인 온보딩 */}
          <div className="flex-1 min-w-0">
            <div className="border border-primary/10 shadow-sm bg-white/80 backdrop-blur-sm transition-all hover:shadow-md p-6 lg:p-8">
              {isProfileLoading && <Spinner />}
              {!isProfileLoading && !isProfileError && (
              <>
                <PersonalPreferences />
                <div className="flex justify-end mt-8 lg:mt-12">
                  <button 
                    className="bg-primary text-white w-[120px] h-[40px] text-center py-2 border border-primary/10 hover:bg-primary/90 transition-all duration-300 disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={putMypage.isPending}
                  >
                    {putMypage.isPending ? '저장하는 중...' : "저장"}
                  </button>
                </div>
              </>
              )}
            </div>
          </div>

          {/* 오른쪽 섹션 - 프로필 정보 & 커플 홈 */}
          <div className="flex-1 min-w-0 xl:max-w-[600px] h-full">
            <div className="flex flex-col gap-6 h-full">
              {/* 커플 홈 섹션 */}
              <div className="h-full border border-primary/10 shadow-sm bg-white/80 backdrop-blur-sm transition-all hover:shadow-md p-6">
                <CoupleHome />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 - 지역구 잠금 시스템 */}
      <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-12 2xl:px-0">
        <div id="district-lock" className="border border-primary/10 shadow-sm bg-white/80 backdrop-blur-sm transition-all hover:shadow-md p-6 lg:p-8">
          <DistrictLock />
        </div>
      </div>
    </div>
    }
  </>
  );
};
