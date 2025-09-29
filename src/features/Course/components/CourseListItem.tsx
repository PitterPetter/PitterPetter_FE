import { useNavigate } from "react-router-dom";

export const CourseListItem = (item: any) => {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col gap-2 h-[320px] border-gray-300 border rounded-2xl pb-6 cursor-pointer"
      onClick={() => {navigate(`/course/${item.id}`)}} // 코스 상세 페이지로 이동
    >
      <div className="flex gap-2">
        <div className="w-full h-[165px] bg-gray-200 rounded-t-2xl"></div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="px-4">{item.id}</h2>
        <p className="text-sm text-gray-500 px-2 py-4">{item.comment}</p>
      </div>
      <div className="w-full absolute bottom-2 flex justify-between px-2 gap-2 items-center">
        <div className="w-[100px] text-sm">{item.created_at.split('T')[0]}</div>
        {/* 추후에 댓글 기능 추가 시 사용
        <div className="flex items-center w-[100px] flex justify-end gap-2 text-sm">
          <FontAwesomeIcon icon={faComment} className="w-[12px] h-[12px]" />
          3
        </div>
        */}
      </div>
    </div>
  )
};