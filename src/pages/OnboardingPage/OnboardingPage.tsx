import { useState } from "react";
import { TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { FoodList, CostList } from "./types";

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [drinking, setDrinking] = useState<number>(0);
  const [active, setActive] = useState<number>(0);
  const [cost, setCost] = useState<CostList>('');
  const [food, setFood] = useState<FoodList[number][]>([]);
  const circleStyle = "border border-gray-300 rounded-full transition-all duration-250 flex justify-center items-center text-white";
  const boxStyle = "w-full h-12 rounded-md transition-all duration-250 flex justify-center items-center border border-gray-300";
  const handleDrinking = (value: number) => {
    setDrinking(value);
  };
  const handleActive = (value: number) => {
    setActive(value);
  };

  // API 연결 후에 호출 코드 추가 예정

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col gap-4 p-4 pt-0 max-w-[450px] md:max-w-[800px]">
        <div className="h-full p-4 pb-6">
          {/* 개인 온보딩 */}
          <div className="mt-4 flex flex-col gap-2 items-center justify-center pt-8">
            <h1 className="text-2xl">혜준 님의 취향을 알려주세요</h1>
            <p className="text-gray-500 pb-8">정보를 입력해 주시면 더 정확한 추천을 해드릴 수 있어요</p>

            <div className="
              flex flex-col w-full gap-8
              md:px-10
            ">
              {/* Drinking */}
              <div className="w-full flex flex-col gap-4">
                <p className="text-black">술을 즐기는 걸 선호한다.</p>
                <div className="
                  w-full
                  grid grid-cols-2 items-center gap-4
                  md:flex md:justify-between md:items-center
                ">
                  <div className="
                    col-span-2 order-2
                    flex justify-between items-center gap-4
                    md:gap-12
                  ">
                    <span
                      className={`
                        w-12 h-12 ${circleStyle} ${drinking === 1 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"}
                        md:w-16 md:h-16
                      `}
                      onClick={() => handleDrinking(1)}
                    >
                      {drinking===1 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                    </span>
                    <span
                      className={`
                        w-10 h-10 ${circleStyle} ${drinking === 2 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"}
                        md:w-14 md:h-14
                      `}
                      onClick={() => handleDrinking(2)}
                    >
                      {drinking===2 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                    </span>
                    <span
                      className={`
                        w-8 h-8 ${circleStyle} ${drinking === 3 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"}
                        md:w-12 md:h-12
                      `}
                      onClick={() => handleDrinking(3)}
                    >
                      {drinking===3 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                    </span>
                    <span
                      className={`
                        w-10 h-10 ${circleStyle} ${drinking === 4 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"}
                        md:w-14 md:h-14
                      `}
                      onClick={() => handleDrinking(4)}
                    >
                      {drinking===4 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                    </span>
                    <span
                      className={`
                        w-12 h-12 ${circleStyle} ${drinking === 5 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"}
                        md:w-16 md:h-16
                      `}
                      onClick={() => handleDrinking(5)}
                    >
                      {drinking===5 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                    </span>
                  </div>
                  <p className="text-red-600 text-md text-left md:order-1">그렇지 않다</p>
                  <p className="text-green-600 text-md text-right md:order-3">그렇다</p>
                </div>
              </div>
              {/* Active */}
              <div className="w-full flex flex-col gap-4">
                <p className="text-black">활동적인 데이트를 선호한다.</p>
                <div className="
                  w-full
                  grid grid-cols-2 items-center gap-2
                  md:flex md:justify-between md:items-center
                ">
                  <div className="
                    col-span-2 order-2
                    flex justify-between items-center gap-4
                    md:gap-12
                  ">
                    <span
                      className={`
                        w-12 h-12 ${circleStyle} ${active === 1 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"}
                        md:w-16 md:h-16
                      `}
                      onClick={() => handleActive(1)}
                    >
                      {active===1 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                    </span>
                    <span
                      className={`
                        w-10 h-10 ${circleStyle} ${active === 2 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"}
                        md:w-14 md:h-14
                      `}
                      onClick={() => handleActive(2)}
                    >
                      {active===2 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                    </span>
                    <span
                      className={`
                        w-8 h-8 ${circleStyle} ${active === 3 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"}
                        md:w-12 md:h-12
                      `}
                      onClick={() => handleActive(3)}
                    >
                      {active===3 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                    </span>
                    <span
                      className={`
                        w-10 h-10 ${circleStyle} ${active === 4 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"}
                        md:w-14 md:h-14
                      `}
                      onClick={() => handleActive(4)}
                    >
                      {active===4 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                    </span>
                    <span
                      className={`
                        w-12 h-12 ${circleStyle} ${active === 5 ? "bg-[#93000A]/60" : "hover:bg-[#93000A]/40"}
                        md:w-16 md:h-16
                      `}
                      onClick={() => handleActive(5)}
                    >
                      {active===5 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                    </span>
                  </div>
                  <p className="text-red-600 text-md text-left md:order-1">그렇지 않다</p>
                  <p className="text-green-600 text-md text-right md:order-3">그렇다</p>
                </div>
              </div>

              <div className="w-full flex flex-col gap-2">
                <p className="text-black">선호하는 음식은 무엇인가요?</p>
                <div className="flex gap-2 w-full justify-between w-full">
                  <span className={`${boxStyle} ${food.includes('한식') ? "bg-[#93000A]/60 text-white" : "text-[#121920]"}`} onClick={() => setFood((prev) => prev.includes('한식') ? prev.filter((x) => x !== '한식') : [...prev, '한식'])}>한식</span>
                  <span className={`${boxStyle} ${food.includes('중식') ? "bg-[#93000A]/60 text-white" : "text-[#121920]"}`} onClick={() => setFood((prev) => prev.includes('중식') ? prev.filter((x) => x !== '중식') : [...prev, '중식'])}>중식</span>
                  <span className={`${boxStyle} ${food.includes('양식') ? "bg-[#93000A]/60 text-white" : "text-[#121920]"}`} onClick={() => setFood((prev) => prev.includes('양식') ? prev.filter((x) => x !== '양식') : [...prev, '양식'])}>양식</span>
                  <span className={`${boxStyle} ${food.includes('분식') ? "bg-[#93000A]/60 text-white" : "text-[#121920]"}`} onClick={() => setFood((prev) => prev.includes('분식') ? prev.filter((x) => x !== '분식') : [...prev, '분식'])}>분식</span>
                  <span className={`${boxStyle} ${food.includes('일식') ? "bg-[#93000A]/60 text-white" : "text-[#121920]"}`} onClick={() => setFood((prev) => prev.includes('일식') ? prev.filter((x) => x !== '일식') : [...prev, '일식'])}>일식</span>
                </div>
              </div>
              {/* Cost */}
              <div className="w-full flex flex-col gap-2">
                <p className="text-black">데이트 비용은 얼마를 선호하시나요?</p>
                <div className="flex gap-2 w-full justify-between w-full">
                <span className={`${boxStyle} ${cost==='1만원 이하' ? "bg-[#93000A]/60 text-white" : "text-[#121920]"}`} onClick={() => setCost('1만원 이하')}>1만원 이하</span>
                <span className={`${boxStyle} ${cost==='1 ~ 3만원' ? "bg-[#93000A]/60 text-white" : "text-[#121920]"}`} onClick={() => setCost('1 ~ 3만원')}>1 ~ 3만원</span>
                <span className={`${boxStyle} ${cost==='3 ~ 5만원' ? "bg-[#93000A]/60 text-white" : "text-[#121920]"}`} onClick={() => setCost('3 ~ 5만원')}>3 ~ 5만원</span>
                <span className={`${boxStyle} ${cost==='5 ~ 8만원' ? "bg-[#93000A]/60 text-white" : "text-[#121920]"}`} onClick={() => setCost('5 ~ 8만원')}>5 ~ 8만원</span>
                <span className={`${boxStyle} ${cost==='8만원 이상' ? "bg-[#93000A]/60 text-white" : "text-[#121920]"}`} onClick={() => setCost('8만원 이상')}>8만원 이상</span>
                </div>
              </div>
              {/* Atmosphere */}
              <div className="w-full flex flex-col gap-2">
                <p className="text-black">어떤 분위기를 선호하세요?</p>
                <TextField id="outlined-basic" variant="outlined" placeholder="입력해주세요." />
              </div>
            </div>
          </div>
          {/* Button - API 연결 후 Post하고 메인 페이지로 이동 추가 예정 */}
          <div className="flex justify-center items-center mt-12">
            <div className="flex justify-center items-center w-[304px] h-[64px] bg-[#FFEDED] text-[#121920] px-4 py-2 rounded-md cursor-pointer"
            onClick={() => {
              navigate("/");
            }}>
              저장하기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};