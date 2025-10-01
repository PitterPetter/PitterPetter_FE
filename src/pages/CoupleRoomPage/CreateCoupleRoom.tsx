import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { postCoupleRoom } from "../../features/auth/api";
import { PostCoupleRoom, GetId } from "../../features/auth/types";

export const CreateCoupleRoom = () => {
  const navigate = useNavigate();
  sessionStorage.setItem('accessToken', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMTYxNTgwODQ5OTA4NTAyOTM2ODgiLCJ1c2VyX2lkIjo0LCJpYXQiOjE3NTkyOTY3ODMsImV4cCI6MTc1OTMwMDM4M30.f6X_08YvxRA_PI0TXS0q8MlJvppCKysLoKLi4tafy38');
  const [coupleName, setCoupleName] = useState('');
  const [coupleDate, setCoupleDate] = useState(new Date());
  const [isSave, setIsSave] = useState(false);
  const [response, setResponse] = useState<GetId | null>(null);

  const handleSave = async () => {
    const res = await postCoupleRoom({
      name: coupleName,
      date: coupleDate.toISOString(),
    });
    setResponse(res.data);
    setIsSave(true);
  };

  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-64px)]">
      <div className="h-[700px] w-[700px] border-gray-300 border rounded-2xl p-4 pb-6 flex flex-col gap-4 justify-center items-center">
        {isSave ? (
          <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="text-xl font-bold py-4">커플 정보 설정</h1>
            <div className="flex items-center gap-2 p-2">
              <p className="font-mono text-lg">{response?.coupleId}</p>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(response?.inviteCode ?? '');
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
            <Button variant="contained" onClick={handleSave}>저장</Button>
          </div>
        )}
        
      </div>
    </div>
  );
};