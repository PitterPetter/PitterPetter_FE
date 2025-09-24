import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

export const CreateCoupleRoom = () => {
  const navigate = useNavigate();
  const [coupleName, setCoupleName] = useState('');
  const [coupleDate, setCoupleDate] = useState(new Date());
  const [isSave, setIsSave] = useState(false);
  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-64px)]">
      <div className="h-[700px] w-[700px] border-gray-300 border rounded-2xl p-4 pb-6 flex flex-col gap-4 justify-center items-center">
        {isSave ? (
          <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="text-xl font-bold py-4">커플 정보 설정</h1>
            <div className="flex items-center gap-2 p-2">
              <p className="font-mono text-lg">14dfhs</p>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText('14dfhs');
                }}
              >
                복사
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="text-xl font-bold py-4">커플 정보 설정</h1>
            <p className="text-sm font-bold">커플 정보를 설정해주세요</p>
            <div className="flex flex-col gap-2 justify-center items-center">
              <p className="text-sm font-bold">커플 홈 이름을 입력하세요</p>
              <TextField id="filled-basic" label="이름" variant="filled" placeholder="입력해주세요" className="bg-white cursor-not-allowed" value={coupleName} onChange={(e) => setCoupleName(e.target.value)} />
            </div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker defaultValue={new Date()} value={coupleDate} onChange={(date) => setCoupleDate(date as Date)} />
            </LocalizationProvider>
            <Button variant="contained" onClick={() => setIsSave(true)}>저장</Button>
          </div>
        )}
        
      </div>
    </div>
  );
};