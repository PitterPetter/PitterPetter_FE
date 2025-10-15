import { ConnectCourse } from "../../features/diary/components/ConnectCourse";
import { Review } from "../../features/diary/components/Review";
import { WriteDiary } from "../../features/diary/components/WriteDiary";
import { useNavigate } from "react-router-dom";
import { diaryCreateApi } from "../../features/diary/api";
import { useDiaryStore } from "../../shared/store/diary.store";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { DiaryCreatePayload } from "../../features/diary/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const CreateDiaryPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    diaryTitle,
    diaryContent,
    diaryImage,
    resetDiaryForm,
    courseId,
    courseName,
    rating,
  } = useDiaryStore();

  // 새 다이어리 작성 시 폼 초기화
  useEffect(() => {
    resetDiaryForm();
  }, [resetDiaryForm]);

  const { mutateAsync: createDiary, isPending } = useMutation({
    mutationKey: ["diaryCreate"],
    mutationFn: async (payload: DiaryCreatePayload) => {
      console.log("payload", payload);
      return diaryCreateApi.createDiary(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
      toast.success("다이어리가 성공적으로 저장되었습니다.");
      resetDiaryForm();
      navigate("/diary");
    },
    onError: (err) => {
      console.error("Failed to create diary:", err);
      toast.error("다이어리 저장에 실패했습니다.");
    },
  });

  const handleCancel = () => {
    const isReal = confirm(
      "정말 취소하시겠습니까?\n(취소할 경우, 작성한 내용은 사라집니다)"
    );
    if (isReal) navigate("/diary");
  };

  const handleSaveAsDraft = () => {
    // TODO: 임시저장 API 연동
    console.log("임시저장");
    toast.info("임시저장은 곧 지원될 예정입니다.");
  };

  const handleSave = async () => {
    // 간단 유효성 검사
    if (!diaryTitle?.trim()) {
      toast.error("제목을 입력해 주세요.");
      return;
    }
    if (!diaryContent?.trim()) {
      toast.error("내용을 입력해 주세요.");
      return;
    }

    const requestData: DiaryCreatePayload = {
      title: diaryTitle,
      content: diaryContent,
      courseId,
      courseName,
      rating: rating.toString(),
      image: diaryImage
        ? {
            originalFileName: diaryImage.name,
            contentType: diaryImage.type,
            sizeBytes: diaryImage.size,
          }
        : null,
      removeImage: !diaryImage,
    };

    await createDiary(requestData);
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
          <button
            onClick={handleCancel}
            className="flex items-center justify-center w-[120px] h-[45px] bg-third/20 text-white rounded-md cursor-pointer border border-primary/10 hover:bg-third/40 transition-all duration-300"
            type="button"
          >
            취소
          </button>
          <button
            onClick={handleSaveAsDraft}
            className="flex items-center justify-center w-[120px] h-[45px] bg-third/40 text-white rounded-md cursor-pointer border border-primary/10 hover:bg-third/60 transition-all duration-300"
            type="button"
          >
            임시저장
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center justify-center w-[120px] h-[45px] bg-third/60 text-white rounded-md cursor-pointer border border-primary/10 hover:bg-third/80 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            type="button"
          >
            {isPending ? "저장 중…" : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
};
