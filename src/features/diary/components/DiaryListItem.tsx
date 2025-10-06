import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const DiaryListItem = (item: any) => {
  console.log(item);
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col gap-2 h-[320px] border-gray-300 border rounded-2xl pb-6 cursor-pointer"
      onClick={() => {navigate(`/diary/${item.id}`)}}
    >
      <div className="absolute top-2 right-3">
        <FontAwesomeIcon icon={faHeart} className={`w-[15px] h-[15px] hover:text-red-300 ${item.isLiked ? "text-pink-400" : "text-gray-500"}`}
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
        <div className="flex items-center w-[100px] flex justify-end gap-1 text-sm text-gray-500">
          <FontAwesomeIcon icon={faComment} className="w-[12px] h-[12px]" />
          3
        </div>
      </div>
    </div>
  )
}