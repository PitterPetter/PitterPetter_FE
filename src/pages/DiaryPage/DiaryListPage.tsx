import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { DiaryListItem } from "../../features/diary";

const mockData = [
  {
    id: 1,
    title: '다이어리 1',
    content: '다이어리 1 내용',
    createdAt: '2025.09.16',
    isLiked: true,
  },
  {
    id: 2,
    title: '다이어리 2',
    content: '다이어리 2 내용',
    createdAt: '2025.09.16',
    isLiked: true,
  },
  {
    id: 3,
    title: '다이어리 3',
    content: '다이어리 3 내용',
    createdAt: '2025.09.16',
    isLiked: false,
  },
];

export const DiaryListPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-[800px] h-[100vh]">
      <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6">
          <div className="flex gap-2 justify-between py-4">
            <div className="w-full font-bold">
              저장된 다이어리 목록
            </div>
            <Button variant="outlined" className="w-[170px]" onClick={() => {navigate("/diary")}}>새 다이어리 만들기</Button>
          </div>
          <div className="grid grid-cols-3 grid-rows-3 gap-4">
            {
              mockData.map((item) => (
                <DiaryListItem key={item.id} {...item} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};