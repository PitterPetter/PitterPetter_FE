import { ConnectCourse } from "../../features/diary/components/ConnectCourse";
import { Review } from "../../features/diary/components/Review";
import { WriteDiary } from "../../features/diary/components/WriteDiary";
import { useNavigate } from "react-router-dom";

export const CreateDiaryPage = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    const isReal = confirm('정말 취소하시겠습니까?\n(취소할 경우, 작성한 내용은 사라집니다)');
    if (isReal) {
      navigate('/diary');
    }
  };

  const handleSaveAsDraft = () => {
    // API 연동 후 임시저장
    console.log('임시저장');
  };

  const handleSave = () => {
    // API 연동 후 저장
    console.log('저장');
  };
  
  return (
    <div className="w-full h-full flex flex-col gap-6 items-center justify-start py-10 bg-primary/5">
      {/* 코스 연결 */}
      <ConnectCourse />

      {/* 리뷰 */}
      <div className="h-full rounded-2xl p-4 pb-6 w-[800px] bg-white">
        <Review />
      </div>

      {/* 게시물 작성 */}
      <div className="h-full rounded-2xl p-4 pb-6 w-[800px] bg-white">
        <WriteDiary />
        <div className="flex justify-end gap-4 p-4">
          <div
            onClick={handleCancel}
            className="flex items-center justify-center w-[120px] h-[45px] bg-third/20 text-white rounded-md cursor-pointer border border-primary/10 hover:bg-third/40 transition-all duration-300"
          >
            취소
          </div>
          <div
            onClick={handleSaveAsDraft}
            className="flex items-center justify-center w-[120px] h-[45px] bg-third/40 text-white rounded-md cursor-pointer border border-primary/10 hover:bg-third/60 transition-all duration-300"
          >
            임시저장
          </div>
          <div
            onClick={handleSave}
            className="flex items-center justify-center w-[120px] h-[45px] bg-third/60 text-white rounded-md cursor-pointer border border-primary/10 hover:bg-third/80 transition-all duration-300"
          >
            저장하기
          </div>
        </div>
      </div>
    </div>
  );
};