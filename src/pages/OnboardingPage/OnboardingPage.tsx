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

  // API 연결 후에 호출 코드 추가 예정

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col gap-4 p-4 pt-0 w-[800px]">
        <div className="h-full p-4 pb-6">
          {/* 개인 온보딩 */}
          <div className="mt-4 flex flex-col gap-8 items-center justify-center">
            <h1 className="text-xl font-bold py-8">혜준 님의 취향을 알려주세요</h1>
            <p className="text-gray-500">정보를 입력해 주시면 더 정확한 추천을 해드릴 수 있어요</p>
            <div className="flex flex-col gap-8 px-20">
              <div className="w-full flex flex-col gap-2">
                <p className="text-gray-500">술을 즐기는 걸 선호한다.</p>
                <div className="flex gap-2">
                  <p className="text-gray-500">그렇지 않다</p>
                  <Slider defaultValue={5} aria-label="Temperature" valueLabelDisplay="auto" min={0} max={10} />
                  <p className="text-gray-500">그렇다</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500">활동적인 데이트를 선호한다.</p>
              </div>
              <div className="flex gap-2">
                <p>그렇지 않다</p>
                <Slider defaultValue={5} aria-label="Temperature" valueLabelDisplay="auto" min={0} max={10} />
                <p>그렇다</p>
              </div>
              <div className="w-full flex flex-col gap-2">
                <p className="text-gray-500">선호하는 음식은 무엇인가요?</p>
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
                <p className="text-gray-500">데이트 비용은 얼마를 선호하시나요?</p>
                <div className="flex gap-2 w-full justify-between w-full">
                  <Button variant={cost==='1' ? "contained" : "outlined"} className="w-full whitespace-nowrap" onClick={() => setCost('1')}>1만원 이하</Button>
                  <Button variant={cost==='2' ? "contained" : "outlined"} className="w-full whitespace-nowrap" onClick={() => setCost('2')}>1 ~ 3만원</Button>
                  <Button variant={cost==='3' ? "contained" : "outlined"} className="w-full whitespace-nowrap" onClick={() => setCost('3')}>3 ~ 5만원</Button>
                  <Button variant={cost==='4' ? "contained" : "outlined"} className="w-full whitespace-nowrap" onClick={() => setCost('4')}>5 ~ 8만원</Button>
                  <Button variant={cost==='5' ? "contained" : "outlined"} className="w-full whitespace-nowrap" onClick={() => setCost('5')}>8만원 이상</Button>
                </div>
              </div>
              <div className="w-full flex flex-col gap-2">
                <p className="text-gray-500">어떤 분위기를 선호하세요?</p>
                <TextField id="outlined-basic" variant="outlined" placeholder="입력해주세요." />
              </div>
            </div>
          </div>
          {/* Button - API 연결 후 Post하고 메인 페이지로 이동 추가 예정 */}
          <div className="flex justify-end mt-12 pr-4">
            <Button variant="contained" onClick={() => {
              navigate("/");
            }}>저장</Button>
          </div>
        </div>
      </div>
    </div>
  );
};