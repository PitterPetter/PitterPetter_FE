import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const CourseListPage = () => {
  
  const navigate = useNavigate();
  return (
    <div className="w-[800px] h-[calc(100vh-64px)]">
      <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6">
          <div className="flex gap-2 justify-between py-4">
            <div className="w-full font-bold">
              저장된 코스 목록
            </div>
            <Button variant="outlined" className="w-[170px]" onClick={() => {navigate("/diary")}}>새 다이어리 만들기</Button>
          </div>
          <div className="grid grid-cols-3 grid-rows-3 gap-4">
            {
              [1, 2, 3, 4, 5].map((item) => (
                <div className="flex flex-col gap-2 h-[320px] border-gray-300 border rounded-2xl pb-6 cursor-pointer"
                  onClick={() => {navigate(`/course/${item}`)}} // 코스 상세 페이지로 이동
                >
                  <div className="flex gap-2">
                    <div className="w-full h-[165px] bg-gray-200 rounded-t-2xl"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="px-4">15dfcd</h2>
                    <p className="text-sm text-gray-500 px-2 py-4">드디어 함께 떠난 첫 여행! 제주도의 아름다운 바다와...</p>
                  </div>
                  <div className="w-full flex justify-between px-2 gap-2 items-center">
                    <div className="w-[100px] text-sm">2025.09.16</div>
                    <div className="flex items-center w-[100px] flex justify-end gap-2 text-sm">
                      <FontAwesomeIcon icon={faComment} className="w-[12px] h-[12px]" />
                      3
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};