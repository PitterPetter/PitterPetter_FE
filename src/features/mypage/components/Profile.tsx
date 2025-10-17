import { useRef, useCallback, useMemo } from "react";
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
import { ko } from "date-fns/locale";
import dayjs from "dayjs";
import "dayjs/locale/ko";

export const Profile = () => {
  const { isProfileLoading, isProfileError, name, nickname, setNickname, email, birthdate, setBirthdate } = useMypageStore();
  const { alcoholPreference, activeBound, dateCostPreference, favoriteFoodCategories, atmosphere } = useOnboardingStore();
  
  const originalNickname = useRef<string>('');
  const originalBirthdate = useRef<string>('');
  
  const formattedBirthdateLabel = useMemo(() => {
    if (!birthdate) return "등록되지 않음";
    return dayjs(birthdate).locale("ko").format("YYYY년 M월 D일");
  }, [birthdate]);

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
    if (!date) return;
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    if (formattedDate === originalBirthdate.current) return;

    originalBirthdate.current = formattedDate;
    setBirthdate(formattedDate);
    
    putMypage.mutate({
      nickname,
      birthdate: formattedDate,
      alcoholPreference,
      activeBound,
      dateCostPreference: convertCostPreference(dateCostPreference),
      favoriteFoodCategories,
      atmosphere
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">프로필 정보</h1>
          <p className="mt-1 text-sm text-gray-500">기본 정보는 언제든 업데이트할 수 있어요.</p>
        </div>
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {formattedBirthdateLabel}
        </span>
      </div>

      {isProfileLoading && <Spinner />}
      {isProfileError && (
        <div className="flex h-24 items-center justify-center rounded-xl bg-red-50 text-red-500">
          정보를 불러오는데 실패했습니다.
        </div>
      )}
      {!isProfileLoading && !isProfileError && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-medium text-gray-500">이름</p>
            <p className="mt-2 text-base font-semibold text-gray-900">{name}</p>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-medium text-gray-500">닉네임</p>
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
              className="mt-2 w-full rounded-xl border border-primary/20 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="닉네임을 입력하세요"
            />
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-medium text-gray-500">이메일</p>
            <p className="mt-2 text-base font-semibold text-gray-900">{email}</p>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-medium text-gray-500">생년월일</p>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
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
                      width: "100%",
                      "& .MuiInputBase-root": {
                        backgroundColor: "white",
                        borderRadius: "12px",
                        border: "1px solid rgba(241, 110, 134, 0.2)",
                        height: "42px",
                        padding: "0 12px",
                        fontSize: "0.9rem",
                      },
                      "& .MuiInputBase-root:hover": {
                        borderColor: "rgba(241, 110, 134, 0.4)",
                      },
                      "& .MuiInputBase-root.Mui-focused": {
                        borderColor: "#F16E86",
                        boxShadow: "0 0 0 4px rgba(241, 110, 134, 0.1)",
                      },
                      "& .MuiInput-underline:before, & .MuiInput-underline:after": {
                        display: "none",
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
  );
};
