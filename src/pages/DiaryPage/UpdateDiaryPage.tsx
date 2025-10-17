import { ConnectCourse } from "../../features/diary/components/ConnectCourse";
import { Review } from "../../features/diary/components/Review";
import { WriteDiary } from "../../features/diary/components/WriteDiary";
import { useNavigate, useParams } from "react-router-dom";
import { diaryDetailApi, diaryCreateApi, diaryUpdateApi, diaryImageApi } from "../../features/diary/api";
import { useDiaryStore } from "../../shared/store/diary.store";
import { toast } from 'react-toastify';
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Spinner } from "../../shared/ui/spinner";

export const UpdateDiaryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    diaryTitle, 
    diaryContent, 
    diaryImage, 
    setDiaryTitle, 
    setDiaryContent, 
    setDiaryImage,
    existingImageUrl,
    setExistingImageUrl,
    courseId,
    courseName,
    setCourseId,
    setCourseName,
    rating,
    setRating,
    resetDiaryForm
  } = useDiaryStore();

  // 기존 다이어리 내용 불러오기
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

  // 다이어리 데이터를 store에 설정
  useEffect(() => {
    if (diaryData?.result) {
      setDiaryTitle(diaryData.result.title || '');
      setDiaryContent(diaryData.result.content || '');
      // 기존 이미지 URL 설정
      if (diaryData.result.imageUrl) {
        setExistingImageUrl(diaryData.result.imageUrl);
      }
      // courseId, courseName, rating도 설정 (있는 경우)
      if (diaryData.result.courseId) {
        setCourseId(diaryData.result.courseId.toString());
      }
      if (diaryData.result.courseName) {
        setCourseName(diaryData.result.courseName);
      }
      if (diaryData.result.rating) {
        setRating(parseFloat(diaryData.result.rating));
      }
    }
  }, [diaryData, setDiaryTitle, setDiaryContent, setExistingImageUrl, setCourseId, setCourseName, setRating]);

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

  const handleSave = async () => {
    if (!id) {
      toast.error('다이어리 ID가 없습니다.');
      return;
    }

    try {
      // API 호출을 위한 데이터 형태 구성
      const requestData = {
        title: diaryTitle,
        content: diaryContent,
        image: diaryImage ? {
          originalFileName: diaryImage.name,
          contentType: diaryImage.type,
          sizeBytes: diaryImage.size
        } : null,
        removeImage: diaryImage ? false : true  // 새 이미지가 있으면 삭제하지 않음, 없으면 삭제
      };

      // PUT로 수정 요청
      const res = await diaryUpdateApi.updateDiary(id, requestData);
      const result = res.data?.result;

      if (!result) {
        throw new Error("다이어리 수정 응답이 올바르지 않습니다.");
      }

      const uploadInfo = (result as any).imageUpload;

      // 이미지가 있고 presignedURL이 있으면 GCS에 업로드
      if (diaryImage && uploadInfo?.presignedUrl && uploadInfo?.imageId) {
        try {
          const uploadResponse = await uploadImageToGCS(uploadInfo.presignedUrl, diaryImage);
          
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
      
      // 성공 시 토스트 메시지와 네비게이션
      toast.success('다이어리가 성공적으로 수정되었습니다.');
      resetDiaryForm(); // store 초기화
      navigate('/diary');
      
      console.log('Diary updated successfully:', res);
    } catch (error) {
      console.error('Failed to update diary:', error);
      toast.error('다이어리 수정에 실패했습니다.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary/5">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary/5">
        <div className="text-center py-8 text-red-500">
          다이어리를 불러오는 중 에러가 발생했습니다: {error.message}
        </div>
      </div>
    );
  }

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
          {/* <div
            onClick={handleSaveAsDraft}
            className="flex items-center justify-center w-[120px] h-[45px] bg-third/40 text-white rounded-md cursor-pointer border border-primary/10 hover:bg-third/60 transition-all duration-300"
          >
            임시저장
          </div> */}
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