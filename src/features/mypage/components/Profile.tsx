import { useState } from "react";
import { mypageApi } from "../api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../../../shared/ui/spinner";
import { useMypageStore } from "../../../shared/store/mypage.store";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

export const Profile = () => {
  const { isProfileLoading, isProfileError, name, nickname, setNickname, email, birthdate, setBirthdate } = useMypageStore();
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex flex-col gap-4 p-0 pt-0">
      {/* 프로필 정보 */}
      <div className="pb-4">
        <h1 className="text-2xl pb-4">프로필 정보</h1>

        {isProfileLoading && <Spinner />}
        {isProfileError && <div className="flex justify-center items-center text-red-500">정보를 불러오는데 실패했습니다.</div>}
        {!isProfileLoading && !isProfileError && (
        <div className="grid grid-cols-2 grid-rows-2 gap-4 px-4">
          <div className="h-full flex flex-col gap-2">
            <h2 className="text-sm font-bold">이름</h2>
            <div className="w-full h-[42px] rounded-md p-3 bg-gray-100 cursor-not-allowed border border-gray-300 text-gray-700">
              {name}
            </div>
          </div>
          <div className="h-full flex flex-col gap-2">
            <h2 className="text-sm font-bold">닉네임</h2>
            <input 
              type="text" 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-[42px] rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent"
              placeholder="닉네임을 입력하세요"
            />
          </div>
          <div className="h-full flex flex-col gap-2">
            <h2 className="text-sm font-bold">이메일</h2>
            <div className="w-full h-[42px] rounded-md p-3 bg-gray-100 cursor-not-allowed border border-gray-300 text-gray-700">
              {email}
            </div>
          </div>
          <div className="h-full flex flex-col gap-2">
            <h2 className="text-sm font-bold">생년월일</h2>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={birthdate ? new Date(birthdate) : null}
                onChange={(date) => {
                  if (date) {
                    setBirthdate(formatDate(date));
                  }
                }}
                format="yyyy-M-d"
                enableAccessibleFieldDOMStructure={false}
                slots={{
                  textField: TextField,
                }}
                slotProps={{
                  textField: {
                    variant: "standard",
                    sx: {
                      "& .MuiInput-underline:before": {
                        borderBottom: "none",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottom: "none",
                      },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "none",
                      },
                      "& .MuiInputBase-root": {
                        backgroundColor: "white",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        height: "42px",
                        padding: "0 4px 0 12px",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};