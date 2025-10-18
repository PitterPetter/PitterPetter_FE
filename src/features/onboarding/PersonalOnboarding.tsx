import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FoodList, CostList } from "./types";
import { useOnboardingStore } from "../../shared/store/onboarding.store";
import { useEffect } from "react";

const FOOD_CATEGORIES = ['한식', '중식', '양식', '일식', '분식'];
const COST_PREFERENCE = ['1만원 이하', '1 ~ 3만원', '3 ~ 5만원', '5 ~ 8만원', '8만원 이상'];

export const PersonalOnboarding = () => {
  const { alcoholPreference, activeBound, dateCostPreference, favoriteFoodCategories, atmosphere, setAlcoholPreference, setActiveBound, setDateCostPreference, setFavoriteFoodCategories, setAtmosphere, setAnsweredCount } = useOnboardingStore();
  const circleStyle = "group cursor-pointer border border-gray-300 rounded-full transition-all duration-250 flex justify-center items-center";
  const boxStyle = "w-full h-12 rounded-md transition-all duration-250 flex justify-center items-center border border-gray-300 hover:border-[#93000A]/70";
  
  const getAnsweredQuestionsCount = () => {
    let count = 0;
    if (alcoholPreference !== 0) count++;
    if (activeBound !== 0) count++;
    if (favoriteFoodCategories.length > 0) count++;
    if (dateCostPreference !== '') count++;
    if (atmosphere && atmosphere.trim() !== '') count++;
    return count;
  };
  
  const answeredCount = getAnsweredQuestionsCount();
  useEffect(() => {
    setAnsweredCount(answeredCount);
  }, [answeredCount]);
  
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
       <div 
         className="flex flex-col w-full gap-6 transition-all duration-500 ease-out md:px-10"
       >
        {/* Drinking */}
        <div className="w-full flex flex-col gap-2 md:gap-4">
          
          <header className="flex flex-col gap-1">
            <p className="text-sm font-medium text-primary/80">Q1.</p>
            <h3 className="text-lg font-semibold text-gray-900">술을 즐기는 편인가요?</h3>
            <span className="text-xs text-gray-500">평소에 얼마나 즐겨 마시는지 떠올려 보세요.</span>
          </header>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>거의 마시지 않아요</span>
            <span>즐겨 마셔요</span>
          </div>
          <div className="w-full grid grid-cols-2 items-center md:gap-4 md:flex md:justify-between md:items-center">
            <div className="col-span-2 order-2 flex justify-between items-center gap-4 md:gap-12 w-full">
              <span
                className={`w-12 h-12 ${circleStyle} md:w-16 md:h-16`}
                onClick={() => setAlcoholPreference(1)}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`transition-opacity duration-200 ${alcoholPreference === 1 ? "opacity-100 text-black" : "opacity-0 text-gray-500 group-hover:opacity-40"}`}
                />
              </span>
              <span
                className={`w-10 h-10 ${circleStyle} md:w-14 md:h-14`}
                onClick={() => setAlcoholPreference(2)}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`transition-opacity duration-200 ${alcoholPreference === 2 ? "opacity-100 text-black" : "opacity-0 text-gray-500 group-hover:opacity-40"}`}
                />
              </span>
              <span
                className={`w-8 h-8 ${circleStyle} md:w-12 md:h-12`}
                onClick={() => setAlcoholPreference(3)}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`transition-opacity duration-200 ${alcoholPreference === 3 ? "opacity-100 text-black" : "opacity-0 text-gray-500 group-hover:opacity-40"}`}
                />
              </span>
              <span
                className={`w-10 h-10 ${circleStyle} md:w-14 md:h-14`}
                onClick={() => setAlcoholPreference(4)}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`transition-opacity duration-200 ${alcoholPreference === 4 ? "opacity-100 text-black" : "opacity-0 text-gray-500 group-hover:opacity-40"}`}
                />
              </span>
              <span
                className={`w-12 h-12 ${circleStyle} md:w-16 md:h-16`}
                onClick={() => setAlcoholPreference(5)}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`transition-opacity duration-200 ${alcoholPreference === 5 ? "opacity-100 text-black" : "opacity-0 text-gray-500 group-hover:opacity-40"}`}
                />
              </span>
            </div>
          </div>
        </div>
        {/* Active */}
        <div className="w-full flex flex-col gap-2 md:gap-4">
          <header className="flex flex-col gap-1">
            <p className="text-sm font-medium text-primary/80">Q2.</p>
            <h3 className="text-lg font-semibold text-gray-900">활동적인 데이트를 좋아하시나요?</h3>
            <span className="text-xs text-gray-500">실내파인지 야외파인지 선택해 보세요.</span>
          </header>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>실내 데이트 선호</span>
            <span>야외 데이트 선호</span>
          </div>
          <div className="w-full grid grid-cols-2 items-center md:gap-2 md:flex md:justify-between md:items-center">
            <div className="col-span-2 order-2 flex justify-between items-center gap-4 md:gap-12 w-full">
              <span
                className={`w-12 h-12 ${circleStyle} md:w-16 md:h-16`}
                onClick={() => setActiveBound(1)}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`transition-opacity duration-200 ${activeBound === 1 ? "opacity-100 text-black" : "opacity-0 text-gray-500 group-hover:opacity-40"}`}
                />
              </span>
              <span
                className={`w-10 h-10 ${circleStyle} md:w-14 md:h-14`}
                onClick={() => setActiveBound(2)}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`transition-opacity duration-200 ${activeBound === 2 ? "opacity-100 text-black" : "opacity-0 text-gray-500 group-hover:opacity-40"}`}
                />
              </span>
              <span
                className={`w-8 h-8 ${circleStyle} md:w-12 md:h-12`}
                onClick={() => setActiveBound(3)}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`transition-opacity duration-200 ${activeBound === 3 ? "opacity-100 text-black" : "opacity-0 text-gray-500 group-hover:opacity-40"}`}
                />
              </span>
              <span
                className={`w-10 h-10 ${circleStyle} md:w-14 md:h-14`}
                onClick={() => setActiveBound(4)}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`transition-opacity duration-200 ${activeBound === 4 ? "opacity-100 text-black" : "opacity-0 text-gray-500 group-hover:opacity-40"}`}
                />
              </span>
              <span
                className={`w-12 h-12 ${circleStyle} md:w-16 md:h-16`}
                onClick={() => setActiveBound(5)}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`transition-opacity duration-200 ${activeBound === 5 ? "opacity-100 text-black" : "opacity-0 text-gray-500 group-hover:opacity-40"}`}
                />
              </span>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <header className="flex flex-col gap-1">
            <p className="text-sm font-medium text-primary/80">Q3.</p>
            <h3 className="text-lg font-semibold text-gray-900">어떤 음식을 좋아하시나요?</h3>
            <span className="text-xs text-gray-500">여러 개를 선택할 수 있어요.</span>
          </header>
          <div className="flex gap-2 w-full justify-between w-full">
            {FOOD_CATEGORIES.map((category) => (
              <span key={category} className={`${boxStyle} ${favoriteFoodCategories.includes(category as FoodList) ? "text-[#93000A] bg-primary/10 " : "text-[#121920]"}`} onClick={() => setFavoriteFoodCategories((prev) => prev.includes(category as FoodList) ? prev.filter((x) => x !== category as FoodList) : [...prev, category as FoodList])}>{category}</span>
            ))}
          </div>
        </div>
        {/* Cost */}
        <div className="w-full flex flex-col gap-2">
          <header className="flex flex-col gap-1">
            <p className="text-sm font-medium text-primary/80">Q4.</p>
            <h3 className="text-lg font-semibold text-gray-900">평균 데이트 비용은 어느 정도인가요?</h3>
            <span className="text-xs text-gray-500">평균적으로 얼마나 사용하는지 떠올려 보세요.</span>
          </header>
          <div className="flex gap-2 w-full justify-between w-full">
            {COST_PREFERENCE.map((preference) => (
              <span key={preference} className={`${boxStyle} ${dateCostPreference===preference ? "text-[#93000A] bg-primary/10 " : "text-[#121920]"}`} onClick={() => setDateCostPreference(preference as CostList)}>{preference}</span>
            ))}
          </div>
        </div>
        {/* Atmosphere */}
        <div className="w-full flex flex-col gap-2">
          <header className="flex flex-col gap-1">
            <p className="text-sm font-medium text-primary/80">Q5.</p>
            <h3 className="text-lg font-semibold text-gray-900">선호하는 데이트 분위기는 무엇인가요?</h3>
            <span className="text-xs text-gray-500">평소에 어떤 분위기를 좋아하는지 떠올려 보세요.</span>
          </header>
          <input type="text" className="w-[360px] md:w-full p-2 h-14 rounded-md transition-all duration-250 flex justify-center items-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#93000A]/50 mx-auto" placeholder="예: 조용하고 로맨틱한, 활기찬, 자연스러운" value={atmosphere} onChange={(e) => setAtmosphere(e.target.value)} />
        </div>
      </div>
    </div>
  )
}
