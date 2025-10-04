// 다이어리 상세 페이지

import { useParams } from "react-router-dom";
import diary from "../../features/diary/mocks/diaryDetail.json";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const DiaryDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const diaryData = diary.data; // 추후에 API 연동 시 ID를 통해 조회

  return (
    <div className="w-full max-w-[800px] h-[100vh]">
      <div className="flex flex-col gap-4 p-4 pt-0 w-full">
        <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6 w-full">

          <div className="flex justify-between p-4 w-full">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold text-gray-800">{diaryData.title}</h1>
              <p className="text-sm text-gray-500">{diaryData.createdAt.split("T")[0]}</p>
            </div>
            <div>
              <Button variant="outlined" onClick={() => {navigate("/diary")}}>목록으로</Button>
            </div>
          </div>
          <div className="flex gap-2 p-4 w-full justify-between">
            <div className="flex flex-col gap-2">
              <p>{diaryData.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};