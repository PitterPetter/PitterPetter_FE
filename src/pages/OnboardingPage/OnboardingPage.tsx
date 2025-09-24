import { useState } from "react";
import { Button } from "@mui/material";
import { TextField } from '@mui/material';
import { Slider } from '@mui/material';
import { useNavigate } from "react-router-dom";


export const OnboardingPage = () => {
  const foodList = ['한식', '중식', '양식', '일식', '분식']; // food category
  const navigate = useNavigate();
  const [cost, setCost] = useState<string>('');
  const [food, setFood] = useState<string[]>([]);
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col gap-4 p-4 pt-0 w-[800px]">
        <div className="h-full p-4 pb-6">
          {/* 개인 온보딩 */}
          <div className="mt-4 flex flex-col gap-8 items-center justify-center">
            <h1 className="text-xl font-bold py-8">Set Your Prefencences</h1>
            <p className="text-gray-500">본인의 성향을 설정해주세요</p>
            <div className="flex flex-col gap-8 px-20">
              <div className="w-full flex flex-col gap-2">
                <p className="text-gray-500">술을 좋아하시나요?</p>
                <div className="flex gap-2">
                  <p className="text-gray-500">No</p>
                  <Slider defaultValue={5} aria-label="Temperature" valueLabelDisplay="auto" min={0} max={10} />
                  <p className="text-gray-500">Yes</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500">활동적이시나요?</p>
              </div>
              <div className="flex gap-2">
                <p>No</p>
                <Slider defaultValue={5} aria-label="Temperature" valueLabelDisplay="auto" min={0} max={10} />
                <p>Yes</p>
              </div>
              <div className="w-full flex flex-col gap-2">
                <p className="text-gray-500">좋아하는 음식</p>
                <div className="flex gap-2 w-full justify-between w-full">
                  {foodList.map((f) => {
                    const selected = food.includes(f);
                    return (
                      <Button
                        key={f}
                        value={f}
                        variant={selected ? "contained" : "outlined"}
                        className="w-full"
                        onClick={() =>
                          setFood((prev) =>
                            prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
                          )
                        }
                      >
                        {f}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div className="w-full flex flex-col gap-2">
                <p className="text-gray-500">평소 데이트 선호 비용은 얼마인가요?</p>
                <div className="flex gap-2 w-full justify-between w-full">
                  <Button variant={cost==='1' ? "contained" : "outlined"} className="w-full whitespace-nowrap" onClick={() => setCost('1')}>1만원 이하</Button>
                  <Button variant={cost==='2' ? "contained" : "outlined"} className="w-full whitespace-nowrap" onClick={() => setCost('2')}>1만원 ~ 3만원</Button>
                  <Button variant={cost==='3' ? "contained" : "outlined"} className="w-full whitespace-nowrap" onClick={() => setCost('3')}>3만원 ~ 5만원</Button>
                  <Button variant={cost==='4' ? "contained" : "outlined"} className="w-full whitespace-nowrap" onClick={() => setCost('4')}>5만원 ~ 8만원</Button>
                  <Button variant={cost==='5' ? "contained" : "outlined"} className="w-full whitespace-nowrap" onClick={() => setCost('5')}>8만원 이상</Button>
                </div>
              </div>
              <div className="w-full flex flex-col gap-2">
                <p className="text-gray-500">어떤 분위기를 선호하시나요?</p>
                <TextField id="outlined-basic" variant="outlined" placeholder="입력해주세요" />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-12 pr-4">
            <Button variant="contained" onClick={() => {
              sessionStorage.setItem("onboarding", "true");
              navigate("/");
            }}>저장</Button>
          </div>
        </div>
      </div>
    </div>
  );
};