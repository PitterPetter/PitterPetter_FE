import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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
    <div className="w-full h-full flex flex-col items-center justify-start py-10">
      <div className="flex flex-col gap-4 p-4 pt-0 w-[900px]">
        <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6">
          <div className="flex gap-2 justify-between py-4">
            <div className="w-full text-2xl">
              다이어리
            </div>
            <div
              className="flex items-center justify-center gap-2 w-[210px] h-[42px] bg-third/60 text-white rounded-xl cursor-pointer border border-primary/10 hover:bg-third/80 transition-all duration-300"
              onClick={() => {navigate("/diary/create")}}
            >
              <FontAwesomeIcon icon={faPlus} className="w-[14px] h-[14px]" />
              새 다이어리 만들기
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
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