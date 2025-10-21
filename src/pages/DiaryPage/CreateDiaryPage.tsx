import { ConnectCourse } from "../../features/diary/components/ConnectCourse";
import { Review } from "../../features/diary/components/Review";
import { WriteDiary } from "../../features/diary/components/WriteDiary";
import { useNavigate } from "react-router-dom";
import { diaryCreateApi, diaryImageApi } from "../../features/diary/api";
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

  const uploadImageToGCS = async (presignedUrl: string, imageFile: File) => {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: imageFile,
      headers: {
        "Content-Type": imageFile.type,
      },
    });

    if (!response.ok) {
      throw new Error(`이미지 업로드에 실패했습니다 (status: ${response.status})`);
    }

    return response;
  };

  const { mutateAsync: createDiary, isPending } = useMutation({
    mutationKey: ["diaryCreate"],
    mutationFn: async ({ payload, imageFile }: { payload: DiaryCreatePayload; imageFile: File | null }) => {
      const response = await diaryCreateApi.createDiary(payload);
      const result = response.data?.result;

      if (!result) {
        throw new Error("다이어리 생성 응답이 올바르지 않습니다.");
      }

      const uploadInfo = (result as any).imageUpload;

      if (imageFile && uploadInfo?.presignedUrl && uploadInfo?.imageId) {
        try {
          const uploadResponse = await uploadImageToGCS(uploadInfo.presignedUrl, imageFile);
          
          // presignedURL로 이미지 업로드가 성공했으면 complete 알림
          if (uploadResponse.ok) {
            await diaryImageApi.notifyComplete(uploadInfo.imageId);
          } else {
            // presignedURL로 이미지 업로드가 실패했으면 fail 알림
            await diaryImageApi.notifyFail(uploadInfo.imageId);
            throw new Error(`이미지 업로드에 실패했습니다 (status: ${uploadResponse.status})`);
          }
        } catch (error) {
          // 업로드 과정에서 에러가 발생했으면 fail 알림
          await diaryImageApi.notifyFail(uploadInfo.imageId).catch(() => {
            console.warn("이미지 업로드 실패 알림 전송에 실패했습니다.");
          });
          throw error;
        }
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
      toast.success("다이어리가 성공적으로 저장되었습니다.");
      resetDiaryForm();
      navigate("/diary");
    },
    onError: (err) => {
      console.error("Failed to create diary:", err);
      const message = err instanceof Error ? err.message : "다이어리 저장에 실패했습니다.";
      toast.error(message);
    },
  });

  const handleCancel = () => {
    const isReal = confirm(
      "정말 취소하시겠습니까?\n(취소할 경우, 작성한 내용은 사라집니다)"
    );
    if (isReal) navigate("/diary");
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

    await createDiary({ payload: requestData, imageFile: diaryImage });
  };

  return (
    <div className="w-full h-full flex flex-col justfiy-center items-center 2xl:flex-row gap-4 md:gap-6 items-center justify-center py-4 md:py-10 bg-primary/5 px-4">
      <div className="w-full h-full 2xl:max-w-[400px] flex flex-col gap-4 md:gap-6 items-center justify-start">
        {/* 코스 연결 */}
        <div className="h-full max-h-[400px] rounded-2xl p-2 md:p-4 pb-6 w-full max-w-[800px] bg-white">
          <ConnectCourse />
        </div>
        {/* 리뷰 */}
        <div className="h-full max-h-[240px] rounded-2xl p-2 md:p-4 pb-6 w-full max-w-[800px] bg-white">
          <Review />
        </div>
      </div>

      {/* 게시물 작성 */}
      <div className="h-full rounded-2xl p-2 md:p-4 pb-6 w-full max-w-[800px] bg-white">
        <WriteDiary />
        <div className="flex justify-end gap-2 md:gap-4 p-2 md:p-4">
          <button
            onClick={handleCancel}
            className="flex items-center justify-center w-[100px] md:w-[120px] h-[40px] md:h-[45px] bg-third/20 text-white text-sm md:text-base rounded-md cursor-pointer border border-primary/10 hover:bg-third/40 transition-all duration-300"
            type="button"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center justify-center w-[100px] md:w-[120px] h-[40px] md:h-[45px] bg-third/60 text-white text-sm md:text-base rounded-md cursor-pointer border border-primary/10 hover:bg-third/80 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            type="button"
          >
            {isPending ? "저장 중…" : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
};
