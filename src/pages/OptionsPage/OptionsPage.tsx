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

export const OptionsPage = () => {
  const navigation = useNavigate();
  const [condition, setCondition] = useState<Option['user_choice']['condition']>(5);
  const [drink_intent, setDrinking] = useState<Option['user_choice']['drink_intent']>(false);
  const [food, setFood] = useState<Option['user_choice']['food']>("");
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const start = useStartStore.getState();
  const mutation = useMutation({
    mutationFn: postOption,
    onSuccess: (data) => {
      useRecommendStore.setState({ data: data });
      navigation("/recommend");
    },
    onError: (error) => {
      console.error(error);
      alert("옵션 전송 실패");
    }
  });
  const handleSubmit = () => {
    console.log({ user_choice: { start: [start.lat, start.lng], condition, drink_intent, food, startTime, endTime } });
    mutation.mutate({ user_choice: { start: [start.lat, start.lng], condition, drink_intent, food, startTime, endTime } });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="w-full h-full flex flex-col items-center justify-center px-80">
        <h1 className="text-2xl font-bold py-4">Set Your Prefencences</h1>
        <p className="text-gray-500 pb-8">원하는 조건을 설정해주세요.</p>
        <div className="w-full flex flex-col gap-8 px-40">

        {/* Start */}
        <div className="flex flex-col gap-2 w-full pb-4">
          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-gray-500">Start</h1>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(e) => setStartTime(e as Date)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
            />
            <h1 className="text-gray-500">End</h1>
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(e) => setEndTime(e as Date)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
            />
          </div>
        </div>

        {/* Condition */}
        <div className="flex flex-col gap-2 w-full pb-4 justify-center">
          <h1 className="text-gray-500">Condition</h1>
          <div className="flex gap-2">
            <p className="text-gray-500 px-2">Bad</p>
            <Slider defaultValue={5} aria-label="Temperature" valueLabelDisplay="auto" min={0} max={10} value={condition} onChange={(e, value) => setCondition(value as Option['user_choice']['condition'])} />
            <p className="text-gray-500 px-2">Good</p>
          </div>
        </div>
        {/* Drinking */}
        <div className="flex flex-col gap-2 w-full pb-4">
          <h1 className="text-gray-500">Drinking</h1>
          <div className="flex gap-4">
          <Button variant={drink_intent ? "contained" : "outlined"} onClick={() => setDrinking(true)}>Yes</Button>
          <Button variant={!drink_intent ? "contained" : "outlined"} onClick={() => setDrinking(false)}>No</Button>
          </div>
        </div>
        {/* Food */}
        <div className="flex flex-col gap-2 w-full pb-4">
          <h1 className="text-gray-500">불호음식 (optional)</h1>
          <TextField id="outlined-basic" variant="outlined" placeholder="입력해주세요" value={food} onChange={(e) => setFood(e.target.value)} />
        </div>
        {/* Button */}
        <div className="flex flex-col gap-4 justify-center items-center w-full pt-8">
          {/* API 연결 후에 Post 후 /recommend로 리다이렉트 */}
          <Button variant="contained" className="w-[180px] h-[60px] bg-blue-600" onClick={handleSubmit}>추천받기</Button>
          <p className="text-gray-500">옵션을 비워도 추천이 가능합니다</p>
        </div>
      </div>
      </div>
    </LocalizationProvider>
  );
};


export default OptionsPage;