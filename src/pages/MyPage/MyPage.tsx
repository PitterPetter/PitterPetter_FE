import { Profile } from "../../features/mypage/components/Profile";
import { CoupleHome } from "../../features/mypage/components/CoupleHome";
import { PersonalOnboarding } from "../../features/onboarding/PersonalOnboarding";
import { useHeaderStore } from "../../shared/store/header.store";
import { useMypageStore } from "../../shared/store/mypage.store";
import { useOnboardingStore } from "../../shared/store/onboarding.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mypageApi } from "../../features/mypage/api";
import { Spinner } from "../../shared/ui/spinner";
import { toast } from 'react-toastify';
import { CostList } from "../../features/onboarding/types";

export const MyPage = () => {
  const isOpen = useHeaderStore((s) => s.isOpen);
  const queryClient = useQueryClient();
  const {
    isProfileLoading, setIsProfileLoading,
    isProfileError, setIsProfileError,
    setName, setNickname, setEmail, setBirthdate,
    nickname,
  } = useMypageStore();
  const {
    setAlcoholPreference, setActiveBound, setDateCostPreference, setFavoriteFoodCategories, setAtmosphere,
    alcoholPreference, activeBound, dateCostPreference, favoriteFoodCategories, atmosphere
   } = useOnboardingStore();

   const convertCostPreference = (cost: string) => {
    const costMap: { [key: string]: string } = {
      '1만원 이하': '만원 미만',
      '1 ~ 3만원': '만원 3만원',
      '3 ~ 5만원': '삼만원 5만원',
      '5 ~ 8만원': '오만원 8만원',
      '8만원 이상': '팔만원 이상',
      '만원 미만': '1만원 이하',
      '만원 3만원': '1 ~ 3만원',
      '삼만원 5만원': '3 ~ 5만원',
      '오만원 8만원': '5 ~ 8만원',
      '팔만원 이상': '8만원 이상',
    };
    return costMap[cost];
  };

  const { data: mypage } = useQuery({
    queryKey: ['mypage'],
    queryFn: async () => {
      try {
        setIsProfileLoading(true);
        const response = await mypageApi.getMypage();
        console.log(convertCostPreference(response.data.data.dateCostPreference));
        setName(response.data.data.name);
        setNickname(response.data.data.nickname);
        setEmail(response.data.data.email);
        setBirthdate(response.data.data.birthdate);
        setAlcoholPreference(response.data.data.alcoholPreference);
        setActiveBound(response.data.data.activeBound);
        setDateCostPreference(convertCostPreference(response.data.data.dateCostPreference) as CostList);
        setFavoriteFoodCategories(response.data.data.favoriteFoodCategories);
        setAtmosphere(response.data.data.atmosphere);
        setIsProfileError(false);
        return response.data.data;
      } catch (error) {
        console.error("mypage 불러오기 실패:", error);
        setIsProfileError(true);
        throw error;
      } finally {
        setIsProfileLoading(false);
      }
    },
  });
  
  const patchMypage = useMutation({
    mutationFn: (data: {
      nickname: string,
      alcoholPreference: number,
      activeBound: number,
      dateCostPreference: string,
      favoriteFoodCategories: string[],
      atmosphere: string
    }) => mypageApi.patchMypage(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['mypage'] });
      toast.success("프로필 저장 성공");
    },
    onError: (error) => {
      toast.error("프로필 저장 실패");
      console.error("프로필 저장 실패:", error);
    },
  });

  const handleSubmit = () => {
    patchMypage.mutate({
      nickname,
      alcoholPreference,
      activeBound,
      dateCostPreference: convertCostPreference(dateCostPreference),
      favoriteFoodCategories,
      atmosphere
    });
  };
  
  return (
    <div
      className="
        flex flex-col 2xl:flex-row gap-8 2xl:gap-4 items-center justify-start py-10 bg-primary/5
        w-full h-full min-h-screen
        2xl:px-20 2xl:items-start
        px-0
      ">
      {/* 왼쪽 섹션 */}
      <div className={`flex flex-col gap-8 w-full ${isOpen ? "min-w-[720px] max-w-[720px]" : "min-w-[720px] max-w-[720px] 2xl:min-w-[850px] 2xl:max-w-[850px]"}`
      }>
        {/* 프로필 카드 */}
        <div className="p-8 border border-primary/10 rounded-2xl shadow-sm bg-white/80 backdrop-blur-sm transition-all hover:shadow-md">
          <Profile />
          {!isProfileLoading && !isProfileError && (
          <div className="flex justify-end mt-12 px-0">
            <div className="bg-third/60 text-white w-[120px] h-[40px] text-center py-2 rounded-md cursor-pointer border border-primary/10 text-gray-500 mt-4 hover:bg-third/80 transition-all duration-300"
              onClick={handleSubmit}
            >
              {patchMypage.isPending ? '저장하는 중...' : "저장"}
            </div>
          </div>
          )}
        </div>

        {/* 개인 온보딩 카드 */}
        <div className="p-8 px-2 md:px-0 border border-primary/10 rounded-2xl shadow-sm bg-white/80 backdrop-blur-sm transition-all hover:shadow-md">
          <h2 className="text-2xl mb-4 text-gray-800 px-2 md:px-8">개인 온보딩</h2>
          {isProfileLoading && <Spinner />}
          {!isProfileLoading && !isProfileError && (
          <>
            <PersonalOnboarding />
            <div className="flex justify-end mt-12 px-8">
              <div className="bg-third/60 text-white w-[120px] h-[40px] text-center py-2 rounded-md cursor-pointer border border-primary/10 text-gray-500 mt-4 hover:bg-third/80 transition-all duration-300"
                onClick={handleSubmit}
              >
                {patchMypage.isPending ? '저장하는 중...' : "저장"}
              </div>
            </div>
          </>
          )}
        </div>
      </div>

      {/* 커플 홈 섹션 */}
      <div className={`
        flex justify-center items-center w-full px-2 md:px-0
        2xl:max-h-[600px]
        border border-primary/10 rounded-2xl shadow-sm bg-white/80 
        backdrop-blur-sm p-6 transition-all hover:shadow-md
        ${isOpen ? "min-w-[720px] max-w-[720px] 2xl:max-w-[720px] 2xl:min-w-[400px]" : "min-w-[720px] max-w-[720px] 2xl:max-w-[850px] 2xl:min-w-[400px]"}
      `}>
        <CoupleHome />
      </div>
    </div>
  );
};
