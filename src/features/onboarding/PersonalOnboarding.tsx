
import { TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FoodList, CostList } from "./types";
import { useOnboardingStore } from "../../shared/store/onboarding.store";

const FOOD_CATEGORIES = ['KOREAN', 'CHINESE', 'WESTERN', 'JAPANESE', 'SNACK'];
const COST_PREFERENCE = ['BELOW_10K', 'FROM_10k_TO_30k', 'FROM_30k_TO_50k', 'FROM_50k_TO_80k', 'ABOVE_80K'];

export const PersonalOnboarding = () => {
  const { alcoholPreference, activeBound, dataCostPreference, favoriteFoodCategories, atmosphere, setAlcoholPreference, setActiveBound, setDataCostPreference, setFavoriteFoodCategories, setAtmosphere } = useOnboardingStore();
  const circleStyle = "border border-gray-300 rounded-full transition-all duration-250 flex justify-center items-center text-white";
  const boxStyle = "w-full h-12 rounded-md transition-all duration-250 flex justify-center items-center border border-gray-300";
  
  return (
    <div className="mt-4 flex flex-col gap-2 items-center justify-center pt-8">

      <div className="
        flex flex-col w-full gap-8
        md:px-10
      ">
        {/* Drinking */}
        <div className="w-full flex flex-col gap-4">
          <p className="text-black">술을 즐기는 걸 선호한다.</p>
          <div className="w-full grid grid-cols-2 items-center gap-4 md:flex md:justify-between md:items-center">
            <div className="col-span-2 order-2 flex justify-between items-center gap-4 md:gap-12">
              <span
                className={`w-12 h-12 ${circleStyle} ${alcoholPreference === 1 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"} md:w-16 md:h-16`}
                onClick={() => setAlcoholPreference(1)}
              >
                {alcoholPreference===1 ? <FontAwesomeIcon icon={faCheck} /> : ""}
              </span>
              <span
                className={`w-10 h-10 ${circleStyle} ${alcoholPreference === 2 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"} md:w-14 md:h-14`}
                onClick={() => setAlcoholPreference(2)}
              >
                {alcoholPreference===2 ? <FontAwesomeIcon icon={faCheck} /> : ""}
              </span>
              <span
                className={`w-8 h-8 ${circleStyle} ${alcoholPreference === 3 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"} md:w-12 md:h-12`}
                onClick={() => setAlcoholPreference(3)}
              >
                {alcoholPreference===3 ? <FontAwesomeIcon icon={faCheck} /> : ""}
              </span>
              <span
                className={`w-10 h-10 ${circleStyle} ${alcoholPreference === 4 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"} md:w-14 md:h-14`}
                onClick={() => setAlcoholPreference(4)}
              >
                {alcoholPreference===4 ? <FontAwesomeIcon icon={faCheck} /> : ""}
              </span>
              <span
                className={`w-12 h-12 ${circleStyle} ${alcoholPreference === 5 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"} md:w-16 md:h-16`}
                onClick={() => setAlcoholPreference(5)}
              >
                {alcoholPreference===5 ? <FontAwesomeIcon icon={faCheck} /> : ""}
              </span>
            </div>
            <p className="text-red-600 text-md text-left md:order-1">그렇지 않다</p>
            <p className="text-green-600 text-md text-right md:order-3">그렇다</p>
          </div>
        </div>
        {/* Active */}
        <div className="w-full flex flex-col gap-4">
          <p className="text-black">활동적인 데이트를 선호한다.</p>
          <div className="w-full grid grid-cols-2 items-center gap-2 md:flex md:justify-between md:items-center">
            <div className="col-span-2 order-2 flex justify-between items-center gap-4 md:gap-12">
              <span
                className={`w-12 h-12 ${circleStyle} ${activeBound === 1 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"} md:w-16 md:h-16`}
                onClick={() => setActiveBound(1)}
              >
                {activeBound===1 ? <FontAwesomeIcon icon={faCheck} /> : ""}
              </span>
              <span
                className={`w-10 h-10 ${circleStyle} ${activeBound === 2 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"} md:w-14 md:h-14`}
                onClick={() => setActiveBound(2)}
              >
                {activeBound===2 ? <FontAwesomeIcon icon={faCheck} /> : ""}
              </span>
              <span
                className={`w-8 h-8 ${circleStyle} ${activeBound === 3 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"} md:w-12 md:h-12`}
                onClick={() => setActiveBound(3)}
              >
                {activeBound===3 ? <FontAwesomeIcon icon={faCheck} /> : ""}
              </span>
              <span
                className={`w-10 h-10 ${circleStyle} ${activeBound === 4 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"} md:w-14 md:h-14`}
                onClick={() => setActiveBound(4)}
              >
                {activeBound===4 ? <FontAwesomeIcon icon={faCheck} /> : ""}
              </span>
              <span
                className={`w-12 h-12 ${circleStyle} ${activeBound === 5 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"} md:w-16 md:h-16`}
                onClick={() => setActiveBound(5)}
              >
                {activeBound===5 ? <FontAwesomeIcon icon={faCheck} /> : ""}
              </span>
            </div>
            <p className="text-red-600 text-md text-left md:order-1">그렇지 않다</p>
            <p className="text-green-600 text-md text-right md:order-3">그렇다</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <p className="text-black">선호하는 음식은 무엇인가요?</p>
          <div className="flex gap-2 w-full justify-between w-full">
            {FOOD_CATEGORIES.map((category) => (
              <span key={category} className={`${boxStyle} ${favoriteFoodCategories.includes(category as FoodList) ? "bg-[#93000A]/60 text-white" : "text-[#121920]"}`} onClick={() => setFavoriteFoodCategories((prev) => prev.includes(category as FoodList) ? prev.filter((x) => x !== category as FoodList) : [...prev, category as FoodList])}>{category}</span>
            ))}
          </div>
        </div>
        {/* Cost */}
        <div className="w-full flex flex-col gap-2">
          <p className="text-black">데이트 비용은 얼마를 선호하시나요?</p>
          <div className="flex gap-2 w-full justify-between w-full">
            {COST_PREFERENCE.map((preference) => (
              <span key={preference} className={`${boxStyle} ${dataCostPreference===preference ? "bg-[#93000A]/60 text-white" : "text-[#121920]"}`} onClick={() => setDataCostPreference(preference as CostList)}>{preference}</span>
            ))}
          </div>
        </div>
        {/* Atmosphere */}
        <div className="w-full flex flex-col gap-2">
          <p className="text-black">어떤 분위기를 선호하세요?</p>
          <TextField id="outlined-basic" variant="outlined" placeholder="입력해주세요." value={atmosphere} onChange={(e) => setAtmosphere(e.target.value)} />
        </div>
      </div>
    </div>
  )
}