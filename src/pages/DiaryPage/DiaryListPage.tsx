import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { DiaryListItem } from "../../features/diary";
import { useQuery } from "@tanstack/react-query";
import { diaryApi } from "../../features/diary/api";
import { Diary } from "../../features/diary/types";
import { Spinner } from "../../shared/ui/spinner";

export const DiaryListPage = () => {
  const navigate = useNavigate();

  const { data: diaryList, isLoading, error } = useQuery({
    queryKey: ['diaries'],
    queryFn: async () => {
      const response = await diaryApi.getDiaryList();
      return response.data.data.content as Diary[];
    }
  });
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-start py-10 bg-primary/5">
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
            {isLoading ? (
              <div className="col-span-3 text-center py-8">
                <Spinner />
              </div>
            ) : error ? (
              <div className="col-span-3 text-center py-8 text-red-500">
                에러가 발생했습니다: {error.message}
              </div>
            ) : (
              diaryList?.map((item: Diary) => (
                <DiaryListItem key={item.diaryId} {...item} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};