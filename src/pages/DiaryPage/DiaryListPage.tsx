import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { DiaryListItem } from "../../features/diary";
import { useQuery } from "@tanstack/react-query";
import { diaryApi } from "../../features/diary/api";
import { Diary, DiaryListResponse } from "../../features/diary/types";
import { Spinner } from "../../shared/ui/spinner";
import { useState } from "react";

export const DiaryListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 6; // 2x3 = 6개

  const { data: diaryData, isLoading, error } = useQuery<DiaryListResponse>({
    queryKey: ['diaries', currentPage],
      queryFn: async () => {
        const response = await diaryApi.getDiaryList(currentPage, pageSize);
        return response.data.result;
      },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });

  const diaryList = diaryData?.content || [];
  const totalPages = diaryData?.page?.totalPages || 0;
  const totalElements = diaryData?.page?.totalElements || 0;
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-start py-10 bg-primary/5">
      <div className="flex flex-col gap-4 p-4 pt-0 min-w-[500px] lg:w-[800px] xl:w-[900px]">
        <div className="h-full xl:border-gray-300 xl:border rounded-2xl p-4 pb-6">
          <div className="flex flex-col xl:flex-row gap-4 justify-between py-4">
            <div className="flex flex-col gap-2">
            <div className="w-full text-2xl">
              다이어리
            </div>
            <p className="text-sm text-gray-500">그동안 써온 추억을 담은 다이어리를 모아봤어요.</p>
            </div>
            <div
              className="flex items-center justify-center gap-2 w-[180px] h-[42px] bg-third/90 text-white rounded-xl cursor-pointer border border-third/10 hover:bg-third/80 transition-all duration-300"
              onClick={() => {navigate("/diary/create")}}
            >
              <FontAwesomeIcon icon={faPlus} className="w-[14px] h-[14px]" />
              새 다이어리 만들기
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-3 text-center py-8">
                <Spinner />
              </div>
            ) : error ? (
              <div className="col-span-3 text-center py-8 text-red-500">
                에러가 발생했습니다: {error.message}
              </div>
            ) : diaryList && diaryList.length > 0 ? (
              diaryList.map((item: Diary) => (
                <DiaryListItem key={item.diaryId} {...item} />
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                작성된 다이어리가 없습니다.
              </div>
            )}
          </div>
          
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 rounded-lg border transition-colors ${
                      currentPage === i
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* 페이지 정보 */}
          <div className="text-center text-sm text-gray-500 mt-2">
            총 {totalElements}개의 다이어리 중 {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)}개 표시
          </div>
        </div>
      </div>
    </div>
  );
};