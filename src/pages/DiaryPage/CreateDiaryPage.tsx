import { ConnectCourse } from "../../features/diary/components/ConnectCourse";
import { Review } from "../../features/diary/components/Review";

export const CreateDiaryPage = () => {
  
  return (
    <div className="w-full h-[100vh] flex flex-col gap-4 items-center justify-center">
      {/* 코스 연결 */}
      <ConnectCourse />

      {/* 리뷰 */}
      <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6 w-[800px]">
        <Review />
      </div>

      {/* 게시물 작성 */}
      <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6 w-[800px]">

      </div>

      {/* 저장 */}
      <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6 w-[800px]">

      </div>
    </div>
  );
};