import { useState } from "react";
import { Input } from "../../shared/ui/input";
import { Button } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';

export const MyPage = () => {
  const [name, setName] = useState('민지');
  return (
    <div className="h-[calc(100vh-64px)] w-[800px]">
      <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6">
          {/* 프로필 정보 */}
          <div>
            <h1 className="text-xl font-bold py-4">프로필 정보</h1>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 px-4">
              <div className="h-full flex flex-col gap-2">
                <h2 className="text-sm font-bold">이름</h2>
                <div className="w-[320px] h-[42px] rounded-md p-2 bg-gray-200 cursor-not-allowed border-2 border-gray-300">
                  김민지
                </div>
              </div>
              <div className="h-full flex flex-col gap-2">
                <h2 className="text-sm font-bold">닉네임</h2>
                <TextField id="filled-basic" label="닉네임" variant="filled" defaultValue={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="h-full flex flex-col gap-2">
                <h2 className="text-sm font-bold">이메일</h2>
                <div className="w-[320px] h-[42px] border-2 border-gray-300 rounded-md p-2 bg-gray-200 cursor-not-allowed">
                  김민지@gmail.com
                </div>
              </div>
              <div className="h-full flex flex-col gap-2">
                <h2 className="text-sm font-bold">생년월일</h2>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker defaultValue={new Date()} />
                  </LocalizationProvider>
                </div>
              </div>
            </div>
          </div>
          {/* 개인 온보딩 */}
          <div>
            <h1 className="text-xl font-bold py-4">개인 온보딩</h1>
            <p>술을 좋아하시나요?</p>
            <p>활동적이시나요?</p>
            <p>좋아하는 음식</p>
            <Input type="text" />
            <p>평소 데이트 선호 비용은 얼마인가요?</p>
            <div className="flex gap-2">
              <Button><span>1만원 이하</span></Button>
              <Button><span>1만원 이상 3만원 이하</span></Button>
              <Button><span>3만원 이상 5만원 이하</span></Button>
              <Button><span>5만원 이상 8만원 이하</span></Button>
              <Button><span>8만원 이상</span></Button>
            </div>
            <p>어떤 분위기를 선호하시나요?</p>
            <Input type="text" />
          </div>
          <Button variant="contained">저장</Button>
        </div>
      </div>
      {/* 커플 홈 */}
      <div className="flex flex-col p-4 pt-0">
        <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6">
          <h1 className="text-xl font-bold py-4">커플 홈</h1>
          <div className="flex flex-col gap-2">
            <div className="flex justify-center items-center w-full font-bold">
              커플명
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-2">
                <div className="bg-gray-200 w-[65px] h-[65px] rounded-full"></div>
                <div className="flex flex-col gap-2 justify-center">
                  <p>박준호</p>
                  <p>@junho_park</p>
                </div>
              </div>
              <div>
                <Button variant="contained">커플 연결 끊기</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 px-4 pt-8">
              <div className="h-full flex flex-col gap-2 justify-center items-center">
                <h2 className="text-sm font-bold">2025.09.16</h2>
                <p>사귄 날</p>
              </div>
              <div className="h-full flex flex-col gap-2 justify-center items-center">
                <h2 className="text-sm font-bold">378</h2>
                <p>함께한 날</p>
              </div>
              <div className="h-full flex flex-col gap-2 justify-center items-center">
                <h2 className="text-sm font-bold">2025.09.16</h2>
                <p>특별한 날</p>
              </div>
              <div className="h-full flex flex-col gap-2 justify-center items-center">
                <h2 className="text-sm font-bold">47</h2>
                <p>함께한 코스</p>
              </div>
            </div>
          </div>
          <Button variant="contained">저장</Button>
        </div>
      </div>
    </div>
  );
};