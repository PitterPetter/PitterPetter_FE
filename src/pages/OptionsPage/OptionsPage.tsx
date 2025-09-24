import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@mui/material";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";

export const OptionsPage = () => {
  const navigation = useNavigate();
  const [condition, setCondition] = useState(5);
  const [drinking, setDrinking] = useState(false);
  // API 연결 후에 호출 코드 추가 예정

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-80">
      <h1 className="text-2xl font-bold py-4">Set Your Prefencences</h1>
      <p className="text-gray-500 pb-8">원하는 조건을 설정해주세요.</p>
      <div className="w-full flex flex-col gap-8 px-40">
        {/* Condition */}
        <div className="flex flex-col gap-2 w-full pb-4 justify-center">
          <h1 className="text-gray-500">Condition</h1>
          <div className="flex gap-2">
            <p className="text-gray-500 px-2">Bad</p>
            <Slider defaultValue={5} aria-label="Temperature" valueLabelDisplay="auto" min={0} max={10} value={condition} onChange={(e, value) => setCondition(value as number)} />
            <p className="text-gray-500 px-2">Good</p>
          </div>
        </div>
        {/* Drinking */}
        <div className="flex flex-col gap-2 w-full pb-4">
          <h1 className="text-gray-500">Drinking</h1>
          <div className="flex gap-4">
          <Button variant={drinking ? "contained" : "outlined"} onClick={() => setDrinking(true)}>Yes</Button>
          <Button variant={!drinking ? "contained" : "outlined"} onClick={() => setDrinking(false)}>No</Button>
          </div>
        </div>
        {/* Food */}
        <div className="flex flex-col gap-2 w-full pb-4">
          <h1 className="text-gray-500">불호음식 (optional)</h1>
          <TextField id="outlined-basic" variant="outlined" placeholder="입력해주세요" />
        </div>
        {/* Button */}
        <div className="flex flex-col gap-4 justify-center items-center w-full pt-8">
          {/* API 연결 후에 Post 후 /recommend로 리다이렉트 */}
          <Button variant="contained" className="w-[180px] h-[60px] bg-blue-600" onClick={() => {navigation("/recommend")}}>추천받기</Button>
          <p className="text-gray-500">옵션을 비워도 추천이 가능합니다</p>
        </div>
      </div>
    </div>
  );
};


export default OptionsPage;