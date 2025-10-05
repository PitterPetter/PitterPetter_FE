import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PhotoStack } from "../../features/auth/components/PhotoStack";

export const CoupleRoomPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="h-[800px] w-[700px] bg-[#DED6D6] border-gray-300 border rounded-2xl p-4 py-16 flex flex-col gap-2 justify-start items-center">
        <PhotoStack />
        <h1 className="text-2xl font-bold pt-12">안녕하세요</h1>
        <p>퍼스널 데이트 매니저 Loventure입니다</p>
        {/* navigation buttons */}
        <div
          className="bg-primary text-black w-[220px] h-[44px] text-center py-2 rounded-md cursor-pointer text-white mt-4 hover:bg-primary/80"
          onClick={() => navigate('/home/coupleroom/create')}
        >
          커플 방 생성
        </div>
        <div
          className="bg-primary text-black w-[220px] h-[44px] text-center py-2 rounded-md cursor-pointer text-white mt-4 hover:bg-primary/80"
          onClick={() => navigate('/home/coupleroom/enter')}
        >
          커플 방 입장
        </div>
      </div>
    </div>
  );
};