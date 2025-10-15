// 다이어리 상세 페이지

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { diaryDetailApi, diaryDeleteApi } from "../../features/diary/api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../../shared/ui/spinner";
import { CommentSection } from "../../features/diary/components/CommentSection";
import { useMutation } from "@tanstack/react-query";

export const DiaryDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: diaryData, isLoading, error } = useQuery({
    queryKey: ['diaryDetail', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('다이어리 ID가 필요합니다.');
      }
      const response = await diaryDetailApi.getDiaryDetail(id);
      return response.data;
    },
    enabled: !!id,
  });

  const deleteDiary = useMutation({
    mutationFn: () => diaryDeleteApi.deleteDiary(id as string),
    onSuccess: () => {
      navigate('/diary');
    },
  });

  return (
    <div className="flex flex-col items-center justify-start p-4 pt-10 w-full bg-primary/5">
      {isLoading? (
        <div className="h-full min-h-[100vh] p-4 pb-6 w-[800px] flex flex-col gap-4 rounded-2xl">
          <Spinner />
        </div>
      ) : error ? (
        <div className="h-full p-4 pb-6 w-[800px] flex flex-col gap-4 bg-white rounded-2xl">
          <div className="text-center py-8 text-red-500">
            에러가 발생했습니다: {error.message}
          </div>
        </div>
      ) : (
      <div className="h-full p-4 pb-6 w-[800px] flex flex-col gap-4 bg-white rounded-2xl">
        {/* 다이어리 제목 및 날짜 */}
        <div className="flex justify-between p-4 pr-0 w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-gray-800">{diaryData?.result.title}</h1>
            <p className="text-sm text-gray-500">작성자: {diaryData?.result.author}</p>
            <p className="text-sm text-gray-500">{diaryData?.result.createdAt.split("T")[0]}</p>
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
          </div>
          <div className="flex items-center justify-end gap-2">
            <div
              className="flex items-center justify-center w-[120px] h-[45px] text-white rounded-md cursor-pointer border border-primary/10 bg-third/40 hover:bg-third/60 transition-all duration-300"
              onClick={() => {navigate(`/diary/update/${id}`)}}
            >
              수정하기
            </div>
            <div className="flex items-center justify-center w-[120px] h-[45px] text-white rounded-md cursor-pointer border border-primary/10 bg-third/60 hover:bg-third/80 transition-all duration-300"
              onClick={() => {deleteDiary.mutate()}}
            >
              삭제하기
            </div>
          </div>
        </div>

        {/* 본문 이미지 */}
        <div className="w-full h-full rounded-md">
          <img src={diaryData?.result.imageUrl ?? diaryData?.result.imageUpload.presignedUrl} alt="diaryImage" className="w-full h-full object-cover" />
          {/* 추후 추가 예정 */}
          <p className="w-full h-full p-2">{diaryData?.result.content}</p>
        </div>

        {/* 코스 정보 */}
        <div className="flex flex-col gap-4 p-4 h-full border-y border-gray-300">
          <h2 className="text-lg text-gray-800">연관된 코스</h2>
          <div className="flex items-center justify-start gap-2 bg-white p-4 rounded-md">
            <div className="w-[80px] h-[80px] bg-gray-300 rounded-md">

            </div>
            <div className="flex flex-col w-full h-full gap-2 items-start justify-start">
              <p className="text-sm text-gray-500">코스 코드: {diaryData?.result.contentId}</p>
              <div className="text-sm text-gray-500">
                {diaryData?.result.title}
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
                <FontAwesomeIcon icon={faStar} className={`w-[16px] h-[16px] ${item <= Math.floor(parseFloat(diaryData?.result.rating)) ? 'text-yellow-400' : 'text-gray-300'}`} />
              </div>
            ))}
            <div className="text-sm text-gray-500">
              {diaryData?.result.rating}
            </div>
          </div>
        </div>

        {/* 댓글 */}
        {id && (
          <CommentSection 
            diaryId={id} 
            comments={diaryData?.result.comments || []} 
          />
        )}
      </div>
      )}
    </div>
  );
};