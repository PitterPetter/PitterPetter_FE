// 다이어리 상세 페이지

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { diaryDetailApi, diaryDeleteApi } from "../../features/diary/api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../../shared/ui/spinner";
import { CommentSection } from "../../features/diary/components/CommentSection";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import logo from "/logo.png";

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
      toast.success("다이어리가 성공적으로 삭제되었습니다.");
      navigate('/diary');
    },
  });

  return (
    <div className="flex flex-col items-center justify-start p-4 pt-4 md:pt-10 w-full bg-primary/5">
      {isLoading? (
        <div className="h-full min-h-[100vh] p-2 md:p-4 pb-6 w-full max-w-[800px] flex flex-col gap-4 rounded-2xl">
          <Spinner />
        </div>
      ) : error ? (
        <div className="h-full p-2 md:p-4 pb-6 w-full max-w-[800px] flex flex-col gap-4 bg-white rounded-2xl">
          <div className="text-center py-8 text-red-500">
            에러가 발생했습니다: {error.message}
          </div>
        </div>
      ) : (
      <div className="h-full p-2 md:p-4 pb-6 w-full max-w-[800px] flex flex-col gap-4 bg-white rounded-2xl">
        {/* 다이어리 제목 및 날짜 */}
        <div className="flex flex-col md:flex-row justify-between p-2 md:p-4 pr-0 w-full gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800">{diaryData?.result.title}</h1>
            <p className="text-xs md:text-sm text-gray-500">작성자: {diaryData?.result.author}</p>
            <p className="text-xs md:text-sm text-gray-500">{diaryData?.result.createdAt.split("T")[0]}</p>
          </div>
          <div>
            <div
              className="flex items-center justify-center w-[100px] md:w-[120px] h-[40px] md:h-[45px] text-white text-sm md:text-base rounded-md cursor-pointer border border-primary/10 bg-third hover:bg-third/80 transition-all duration-300"
              onClick={() => {navigate("/diary")}}>목록으로</div>
          </div>
        </div>

        {/* 다이어리 내용 */}
        <div className="flex flex-col md:flex-row gap-2 p-2 md:p-4 pr-0 w-full justify-between relative h-full">
          <div className="flex flex-col gap-2 w-full h-full">
          </div>
          <div className="flex items-center justify-end gap-2">
            <div
              className="flex items-center justify-center w-[100px] md:w-[120px] h-[40px] md:h-[45px] text-white text-sm md:text-base rounded-md cursor-pointer border border-primary/10 bg-third/80 hover:bg-third/90 transition-all duration-300"
              onClick={() => {navigate(`/diary/update/${id}`)}}
            >
              수정하기
            </div>
            <div className="flex items-center justify-center w-[100px] md:w-[120px] h-[40px] md:h-[45px] text-white text-sm md:text-base rounded-md cursor-pointer border border-primary/10 bg-third/70 hover:bg-third/80 transition-all duration-300"
              onClick={() => {deleteDiary.mutate()}}
            >
              삭제하기
            </div>
          </div>
        </div>

        {/* 본문 이미지 */}
        <div className="w-full h-full rounded-md max-w-full md:max-w-[500px] max-h-[300px] md:max-h-[500px]">
          {(() => {
            const imageUrl = diaryData?.result.imageUrl;
            const uploadUrl = diaryData?.result.imageUpload?.presignedUrl;
            if (imageUrl) {
              return <img src={imageUrl} alt="diaryImage" className="w-full h-full object-cover rounded-md" />;
            }
            if (uploadUrl) {
              return <img src={uploadUrl} alt="diaryImage" className="w-full h-full object-cover rounded-md" />;
            }
            return (
              <div className="w-full h-[200px] md:h-[300px] flex items-center justify-center rounded-md bg-gray-100 text-gray-500 text-xs md:text-sm">
                등록된 이미지가 없습니다.
              </div>
            );
          })()}
          {/* 다이어리 내용 - 마크다운 렌더링 */}
          <div className="w-full p-2 md:p-4 prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {diaryData?.result.content || ''}
            </ReactMarkdown>
          </div>
        </div>

        {/* 코스 정보 */}
        <div className="flex flex-col gap-2 md:gap-4 p-2 md:p-4 h-full border-y border-gray-300">
          <h2 className="text-base md:text-lg text-gray-800">연관된 코스</h2>
          <div className="flex items-center justify-start gap-2 md:gap-4 bg-white p-2 md:p-4 rounded-md">
            <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] gray-300/40 rounded-md flex items-center justify-center">
              <img src={logo} alt="logo" className="w-auto h-auto object-cover" />
            </div>
            <div className="flex flex-col w-full h-full gap-1 md:gap-2 items-start justify-start">
              <p className="text-xs md:text-sm text-gray-500">코스 코드: {diaryData?.result.contentId}</p>
              <div className="text-xs md:text-sm text-gray-500">
                {diaryData?.result.title}
              </div>
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
