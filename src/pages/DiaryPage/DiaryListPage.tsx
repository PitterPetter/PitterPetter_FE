import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

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
    <div className="w-[800px] h-[calc(100vh-64px)]">
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
                <div className="relative flex flex-col gap-2 h-[320px] border-gray-300 border rounded-2xl pb-6 cursor-pointer"
                  onClick={() => {navigate(`/diary/${item.id}`)}}
                >
                  <div className="absolute top-1 right-4">
                    <FontAwesomeIcon icon={faHeart} className={`w-[12px] h-[12px] hover:text-red-300 ${item.isLiked ? "text-red-500" : "text-gray-500"}`}
                      onClick={() => {item.isLiked = !item.isLiked}}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-full h-[165px] bg-gray-200 rounded-t-2xl"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="px-2">{item.title}</h2>
                    <p className="text-sm text-gray-500 px-2 -4">{item.content}</p>
                  </div>
                  <div className="w-full absolute bottom-2 flex justify-between px-2 gap-2 items-center">
                    <div className="w-[100px] text-sm">{item.createdAt}</div>
                    {/* 추후에 댓글 기능 추가 시 사용
                    <div className="flex items-center w-[100px] flex justify-end gap-2 text-sm">
                      <FontAwesomeIcon icon={faComment} className="w-[12px] h-[12px]" />
                      3
                    </div> */}
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