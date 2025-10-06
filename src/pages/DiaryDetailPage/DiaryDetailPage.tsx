// 다이어리 상세 페이지

import { useParams } from "react-router-dom";
import diary from "../../features/diary/mocks/diaryDetail.json";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const DiaryDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const diaryData = diary.data; // 추후에 API 연동 시 ID를 통해 조회

  return (
    <div className="flex flex-col items-center justify-start p-4 pt-10 w-full">
      <div className="h-full p-4 pb-6 w-[800px] flex flex-col gap-4">
        {/* 다이어리 제목 및 날짜 */}
        <div className="flex justify-between p-4 pr-0 w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-gray-800">{diaryData.title}</h1>
            <p className="text-sm text-gray-500">{diaryData.createdAt.split("T")[0]}</p>
          </div>
          <div>
            <div
              className="flex items-center justify-center w-[120px] h-[45px] text-white rounded-md cursor-pointer border border-primary/10 bg-third/60 hover:bg-third/80 transition-all duration-300"
              onClick={() => {navigate("/diary")}}>목록으로</div>
          </div>
        </div>

        {/* 다이어리 내용 */}
        <div className="flex gap-2 p-4 pr-0 w-full justify-between relative h-full">
          <div className="flex flex-col gap-2 w-full h-full">
            <p>{diaryData.content}</p>
          </div>
          <div>
            <div
              className="flex items-center justify-center w-[120px] h-[45px] text-white rounded-md cursor-pointer border border-primary/10 bg-third/40 hover:bg-third/60 transition-all duration-300"
              onClick={() => {navigate(`/diary/create/${id}`)}}
            >
              수정하기
            </div>
          </div>
        </div>

        {/* 본문 이미지 */}
        <div className="w-full h-[300px] bg-gray-300 rounded-md">
          {/* 추후 추가 예정 */}
        </div>

        {/* 코스 정보 */}
        <div className="flex flex-col gap-4 p-4 h-full border-y border-gray-300">
          <h2 className="text-lg text-gray-800">연관된 코스</h2>
          <div className="flex items-center justify-start gap-2 bg-white p-4 rounded-md">
            <div className="w-[80px] h-[80px] bg-gray-300 rounded-md">

            </div>
            <div className="flex flex-col w-full h-full gap-2 items-start justify-start">
              <p className="text-sm text-gray-500">코스 코드: {diaryData.courseId}</p>
              <div className="text-sm text-gray-500">
                성산일출봉
              </div>
            </div>
          </div>
        </div>

         {/* 리뷰 */}
         <div className="flex gap-4 p-4 py-6 bg-gray-100 h-full rounded-md items-center justify-between my-4">
          <h2 className="text-lg text-gray-800">여행 만족도</h2>
          <div className="flex items-center justify-start gap-2">
            {[1,2,3,4,5].map((item) => (
              <div key={item}>
                <FontAwesomeIcon icon={faStar} className={`w-[16px] h-[16px] ${item <= Math.floor(parseFloat(diaryData.rating)) ? 'text-yellow-400' : 'text-gray-300'}`} />
              </div>
            ))}
            <div className="text-sm text-gray-500">
              {diaryData.rating}
            </div>
          </div>
        </div>

        {/* 댓글 */}
        <div className="flex flex-col gap-4 p-4 h-full rounded-md border-t border-gray-300">
          <h2 className="text-lg text-gray-800">댓글</h2>
          {[1,2].map((item) => (
            <div key={item} className="flex items-center justify-start gap-2 w-full">
              <div className="min-w-[60px] min-h-[60px] bg-gray-300 rounded-full">
              </div>
              <div className="flex justify-between w-full bg-gray-200 rounded-md p-2">
                <div>
                  <p className="text-sm text-gray-500">이름</p>
                  <p className="text-sm text-gray-500">댓글 {item}</p>
                </div>
                <p className="text-sm text-gray-500">2025-01-01</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};