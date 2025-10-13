import { useRef, useCallback } from "react";
import { mypageApi } from "../api";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "../../../shared/ui/spinner";
import { useMypageStore } from "../../../shared/store/mypage.store";
import { useOnboardingStore } from "../../../shared/store/onboarding.store";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { toast } from 'react-toastify';

export const Profile = () => {
  const { isProfileLoading, isProfileError, name, nickname, setNickname, email, birthdate, setBirthdate } = useMypageStore();
  const { alcoholPreference, activeBound, dateCostPreference, favoriteFoodCategories, atmosphere } = useOnboardingStore();
  
  const originalNickname = useRef<string>('');
  const originalBirthdate = useRef<string>('');
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const convertCostPreference = (cost: string) => {
    const costMap: { [key: string]: string } = {
      '1만원 이하': '만원_미만',
      '1 ~ 3만원': '만원_삼만원',
      '3 ~ 5만원': '삼만원_오만원',
      '5 ~ 8만원': '오만원_팔만원',
      '8만원 이상': '팔만원_이상',
    };
    return costMap[cost] || cost;
  };

  const putMypage = useMutation({
    mutationFn: (data: {
      nickname: string,
      birthdate: string,
      alcoholPreference: number,
      activeBound: number,
      dateCostPreference: string,
      favoriteFoodCategories: string[],
      atmosphere: string
    }) => mypageApi.putMypage(data),
    onSuccess: () => {
      toast.success('프로필이 저장되었습니다');
    },
    onError: () => {
      toast.error('저장에 실패했습니다');
    },
  });

  const handleSaveProfile = useCallback(() => {
    putMypage.mutate({
      nickname,
      birthdate,
      alcoholPreference,
      activeBound,
      dateCostPreference: convertCostPreference(dateCostPreference),
      favoriteFoodCategories,
      atmosphere
    });
  }, [nickname, birthdate, alcoholPreference, activeBound, dateCostPreference, favoriteFoodCategories, atmosphere]);

  const handleNicknameBlur = () => {
    // 빈 값이면 저장 안함
    if (!nickname.trim()) {
      setNickname(originalNickname.current);
      return;
    }
    
    if (nickname !== originalNickname.current) {
      originalNickname.current = nickname;
      handleSaveProfile();
    }
  };

  const handleBirthdateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = formatDate(date);
      if (formattedDate !== originalBirthdate.current) {
        originalBirthdate.current = formattedDate;
        setBirthdate(formattedDate);
        
        // state 업데이트는 비동기이므로 직접 새 값으로 API 호출
        putMypage.mutate({
          nickname,
          birthdate: formattedDate,
          alcoholPreference,
          activeBound,
          dateCostPreference: convertCostPreference(dateCostPreference),
          favoriteFoodCategories,
          atmosphere
        });
      }
    }
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
              onFocus={() => originalNickname.current = nickname}
              onBlur={handleNicknameBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                  e.currentTarget.blur();
                }
              }}
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
                onChange={handleBirthdateChange}
                onOpen={() => originalBirthdate.current = birthdate}
                format="yyyy-MM-dd"
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