import { useState } from "react";
import { Button } from "@mui/material";
import { TextField } from '@mui/material';
import { Slider } from '@mui/material';


export const Profile = () => {
  const foodList = ['한식', '중식', '양식', '일식', '분식']; // food category
  const [name, setName] = useState('민지');
  const [cost, setCost] = useState<string>('');
  const [food, setFood] = useState<string[]>([]);
  return (
    <div className="w-[800px]">
      <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6">
          {/* 프로필 정보 */}
          <div className="pb-4">
            <h1 className="text-xl font-bold py-4">프로필 정보</h1>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 px-4">
              <div className="h-full flex flex-col gap-2">
                {/* <h2 className="text-sm font-bold">이름</h2>
                <div className="w-[320px] h-[42px] rounded-md p-2 bg-gray-200 cursor-not-allowed border-2 border-gray-300">
                  김민지
                </div> */}
                <TextField id="filled-basic" label="이름" variant="filled" defaultValue="김민지" className="bg-white cursor-not-allowed" />
              </div>
              <div className="h-full flex flex-col gap-2">
                {/* <h2 className="text-sm font-bold">닉네임</h2> */}
                <TextField id="filled-basic" label="닉네임" variant="filled" defaultValue={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="h-full flex flex-col gap-2">
                {/* <h2 className="text-sm font-bold">이메일</h2>
                <div className="w-[320px] h-[42px] border-2 border-gray-300 rounded-md p-2 bg-gray-200 cursor-not-allowed">
                  김민지@gmail.com
                </div> */}
                <TextField id="filled-basic" label="이메일" variant="filled" defaultValue="김민지@gmail.com" className="bg-white cursor-not-allowed" />
              </div>
              <div className="h-full flex flex-col gap-2">
                {/* <h2 className="text-sm font-bold">생년월일</h2>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker defaultValue={new Date()} />
                  </LocalizationProvider>
                </div> */}
                <TextField id="filled-basic" label="생년월일" variant="filled" defaultValue="2000.01.01" className="bg-white cursor-not-allowed" />
              </div>
            </div>
          </div>
          {/* 개인 온보딩 */}
          <div className="mt-4">
            <h1 className="text-xl font-bold py-4">개인 온보딩</h1>
            <div className="flex flex-col gap-8 px-20">
              <div className="w-full flex flex-col gap-2">
                <p>술을 좋아하시나요?</p>
                <div className="flex gap-2">
                  <p>No</p>
                  <Slider defaultValue={5} aria-label="Temperature" valueLabelDisplay="auto" min={0} max={10} />
                  <p>Yes</p>
                </div>
              </div>
              <div>
                <p>활동적이시나요?</p>
              </div>
              <div className="flex gap-2">
                <p>No</p>
                <Slider defaultValue={5} aria-label="Temperature" valueLabelDisplay="auto" min={0} max={10} />
                <p>Yes</p>
              </div>
              <div className="w-full flex flex-col gap-2">
                <p>좋아하는 음식</p>
                <div className="flex gap-2 w-full justify-start">
                  {foodList.map((f) => {
                    const selected = food.includes(f);
                    return (
                      <Button
                        key={f}
                        value={f}
                        variant={selected ? "contained" : "outlined"}
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
                <p>평소 데이트 선호 비용은 얼마인가요?</p>
                <div className="flex gap-2">
                  <Button variant={cost==='1' ? "contained" : "outlined"} onClick={() => setCost('1')}>1만원 이하</Button>
                  <Button variant={cost==='2' ? "contained" : "outlined"} onClick={() => setCost('2')}>1만원 ~ 3만원</Button>
                  <Button variant={cost==='3' ? "contained" : "outlined"} onClick={() => setCost('3')}>3만원 ~ 5만원</Button>
                  <Button variant={cost==='4' ? "contained" : "outlined"} onClick={() => setCost('4')}>5만원 ~ 8만원</Button>
                  <Button variant={cost==='5' ? "contained" : "outlined"} onClick={() => setCost('5')}>8만원 이상</Button>
                </div>
              </div>
              <div className="w-full flex flex-col gap-2">
                <p>어떤 분위기를 선호하시나요?</p>
                <TextField id="outlined-basic" variant="outlined" />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-12 pr-4">
            <Button variant="contained">저장</Button>
          </div>
        </div>
      </div>
    </div>
  );
};