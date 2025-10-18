import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Slider, Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { postOption } from "../../features/option/api";
import { Option } from "./type";
import { useRecommendStore, useStartStore } from "../../shared/store/recommend.store";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Spinner } from "../../shared/ui/spinner";

export const OptionsPage = () => {
  const navigation = useNavigate();
  const [condition, setCondition] = useState<Option['user_choice']['condition']>(5);
  const [drink_intent, setDrinking] = useState<Option['user_choice']['drink_intent']>(false);
  const [food, setFood] = useState<Option['user_choice']['food']>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [timeError, setTimeError] = useState<string>("");
  const start = useStartStore.getState();
  const { setRecommend, setLawData } = useRecommendStore();
  const mutation = useMutation({
    mutationFn: postOption,
    onSuccess: (data) => {
      console.log('Options API response:', data);
      if (data?.explain && data?.data) {
        const mapData = data.data.map((item: any) => ({
          seq: item.seq,
          name: item.name,
          category: item.category,
          lat: item.lat,
          lng: item.lng,
          indoor: item.indoor,
          price_level: item.price_level,
          alcohol: item.alcohol,
          mood_tag: typeof item.mood_tag === 'string' ? parseInt(item.mood_tag) || 0 : item.mood_tag || 0,
        }));
        
        setRecommend({ 
          explain: data.explain,
          data: data.data,
        });
        
        console.log('Set recommend data:', { explain: data.explain, data: data.data });
        setLawData(data.lawData);
        console.log('Set law data:', data.lawData);
      } else {
        // 기존 방식 (배열 직접 반환)
        const mapData = Array.isArray(data) ? data : data?.courses || [];
        
        setRecommend({ 
          explain: "옵션에서 추천받은 코스",
          data: mapData 
        });
        
        console.log('Set recommend data:', { explain: "옵션에서 추천받은 코스", data: mapData });
      }
      navigation("/recommend");
    },
    onError: (error) => {
      setIsLoading(false);
      console.error(error);
      alert("옵션 전송 실패");
    }
  });
  const validateTime = () => {
    const startTimeOnly = new Date();
    startTimeOnly.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
    
    const endTimeOnly = new Date();
    endTimeOnly.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
    
    if (startTimeOnly >= endTimeOnly) {
      setTimeError("시작 시간은 종료 시간보다 빨라야 합니다.");
      return false;
    }
    
    setTimeError("");
    return true;
  };

  const handleStartTimeChange = (newStartTime: Date | null) => {
    if (newStartTime) {
      setStartTime(newStartTime);
      // 시작 시간 변경 시 검증
      setTimeout(() => validateTime(), 0);
    }
  };

  const handleEndTimeChange = (newEndTime: Date | null) => {
    if (newEndTime) {
      setEndTime(newEndTime);
      // 종료 시간 변경 시 검증
      setTimeout(() => validateTime(), 0);
    }
  };

  const handleSubmit = () => {
    if (!validateTime()) {
      return;
    }
    
    setIsLoading(true);
    console.log({ user_choice: { start: [start.lat, start.lng], condition, drink_intent, food, startTime, endTime } });
    mutation.mutate({ user_choice: { start: [start.lat, start.lng], condition, drink_intent, food, startTime, endTime } });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {isLoading && <Spinner />}
      <div className="flex flex-col gap-8 items-center justify-start py-6 md:py-10 bg-primary/5 w-full h-full min-h-screen px-4 lg:px-8 xl:px-12 2xl:px-20">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
          {/* 헤더 섹션 */}
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
            <div className="absolute inset-0 bg-white/30 mix-blend-overlay pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 px-8 py-10">
              <div>
                <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-primary shadow-sm">
                  데이트 옵션 설정
                </span>
                <h1 className="mt-4 text-3xl font-semibold text-gray-900">
                  오늘 데이트의 조건을 설정해주세요
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  시간, 컨디션, 음주 여부 등을 설정하여 맞춤형 추천을 받아보세요.
                </p>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="border border-primary/10 shadow-sm bg-white/80 backdrop-blur-sm transition-all hover:shadow-md p-6 lg:p-8">
            <div className="flex flex-col gap-8">
              {/* 시간 설정 카드 */}
              <div className="border border-primary/10 bg-white/90 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">데이트 시간</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">데이트 시작 시간을 설정해주세요</label>
                    <TimePicker
                      label="Start Time"
                      value={startTime}
                      onChange={handleStartTimeChange}
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">데이트 종료 시간을 설정해주세요</label>
                    <TimePicker
                      label="End Time"
                      value={endTime}
                      onChange={handleEndTimeChange}
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                    />
                  </div>
                </div>
                {timeError && (
                  <p className="text-red-500 text-sm mt-3 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {timeError}
                  </p>
                )}
              </div>

              {/* 컨디션 설정 카드 */}
              <div className="border border-primary/10 bg-white/90 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">오늘의 컨디션</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>피곤해요</span>
                    <span>활기차요</span>
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={condition}
                    valueLabelDisplay="auto"
                    onChange={(e, value) =>
                      setCondition(value as Option['user_choice']['condition'])
                    }
                    sx={{
                      height: 8,
                      color: '#662B2B',
                      '& .MuiSlider-thumb': {
                        width: 20,
                        height: 20,
                        backgroundColor: '#93000A',
                        border: '2px solid white',
                        boxShadow: '0 2px 8px rgba(244, 63, 94, 0.3)',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#93000A',
                        border: 'none',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: '#FFEDED',
                      },
                    }}
                  />
                </div>
              </div>

              {/* 음주 여부 카드 */}
              <div className="border border-primary/10 bg-white/90 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">음주 여부</h3>
                <div className="flex gap-4">
                  <button
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                      drink_intent
                        ? 'border-primary bg-primary text-white shadow-md'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50'
                    }`}
                    onClick={() => setDrinking(true)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-medium">좋아요</span>
                    </div>
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                      !drink_intent
                        ? 'border-primary bg-primary text-white shadow-md'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50'
                    }`}
                    onClick={() => setDrinking(false)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-medium">아니요</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 불호음식 카드 */}
              <div className="border border-primary/10 bg-white/90 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">불호음식 (선택사항)</h3>
                <TextField 
                  id="outlined-basic" 
                  variant="outlined" 
                  placeholder="예: 매운 음식, 생선 등" 
                  value={food} 
                  onChange={(e) => setFood(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#93000A',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#93000A',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* 액션 영역 */}
            <div className="flex justify-end mt-8 lg:mt-12">
              <button
                type="button"
                className={`bg-primary text-white w-[160px] h-[48px] text-center py-2 border border-primary/10 hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 rounded-lg font-medium ${
                  timeError ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (!timeError) {
                    handleSubmit();
                  }
                }}
                disabled={!!timeError}
              >
                {mutation.isPending ? "추천 받는 중..." : "추천 받기"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};


export default OptionsPage;