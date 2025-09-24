import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const CoupleRoomPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-64px)]">
      <div className="h-[700px] w-[700px] border-gray-300 border rounded-2xl p-4 pb-6 flex flex-col gap-4 justify-center items-center">
        <h1 className="text-xl font-bold py-4">커플 방</h1>
        {/* navigation buttons */}
        <Button variant="contained" onClick={() => navigate('/coupleroom/create')}>커플 방 생성</Button>
        <Button variant="contained" onClick={() => navigate('/coupleroom/enter')}>커플 방 입장</Button>
      </div>
    </div>
  );
};