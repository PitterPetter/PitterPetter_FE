import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Diary } from "../types";
import logo from "/logo.png";

export const DiaryListItem = (item: Diary) => {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col gap-2 h-[240px] sm:h-[256px] md:h-[320px] w-full xl:w[267px] border-gray-300 border rounded-[20px] pb-4 sm:pb-6 cursor-pointer group transition-all"
      onClick={() => {navigate(`/diary/${item.diaryId}`)}}
    >
      <div className="flex gap-2">
        <div className="w-full h-[140px] sm:h-[165px] bg-gray-200 rounded-t-[19.2px] overflow-hidden">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center transition-colors duration-500 ease-in-out">
              <img src={logo} alt="logo" className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform duration-500 ease-in-out" />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="px-2 py-2 ml-1 group-hover:ml-0 text-white font-medium text-sm sm:text-md truncate bg-third rounded-l-lg group-hover:rounded-l-none text-white transition-all duration-300">{item.title}</h2>
        <p className="hidden md:block text-xs sm:text-sm text-gray-500 px-2 line-clamp-2 group-hover:text-gray-900 transition-all duration-300">{item.excerpt}</p>
      </div>
      <div className="w-full absolute bottom-2 flex justify-between px-2 gap-2 items-center">
        <div className="w-[100px] text-xs sm:text-sm text-gray-500">{item.updatedAt?.split('T')[0]}</div>
        <div className="flex items-center w-[100px] flex justify-end gap-1 text-xs sm:text-sm text-gray-500">
          <FontAwesomeIcon icon={faComment} className="w-[10px] h-[10px] sm:w-[12px] sm:h-[12px]" />
          {item.commentCount ?? 0}
        </div>
      </div>
    </div>
  )
}