import { useState } from "react";
import { Button } from "@mui/material";
import { TextField } from '@mui/material';


export const Profile = () => {
  const [name, setName] = useState('민지');
  return (
      <div className="flex flex-col gap-4 p-4 pt-0">
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
      </div>
  );
};