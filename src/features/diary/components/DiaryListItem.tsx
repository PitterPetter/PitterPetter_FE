import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const DiaryListItem = (item: any) => {
  console.log(item);
  const navigate = useNavigate();
  return (
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
  )
}