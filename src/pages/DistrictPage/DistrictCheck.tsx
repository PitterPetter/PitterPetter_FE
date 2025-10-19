import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useDistrictStore } from '../../shared/store/district.store';
import { useAuthStore } from '../../shared/store/auth.store';
import { authApi } from '../../features/auth/api';
import { toast } from 'react-toastify';
import { Spinner } from '../../shared/ui/spinner';
import namsantower from '/namsantower.jpg';
import { districtApi } from '../../features/district/api';
import { redirectBasedOnStatus } from '../../shared/utils/authRedirect';

export const DistrictCheck = () => {
  const navigate = useNavigate();
  const { selectedDistricts, clearSelectedDistricts } = useDistrictStore();
  const { setPermissionLevel } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 지역구 선택 확인 API 호출 (초기 해금)
  const confirmDistrictMutation = useMutation({
    mutationFn: async (districtNames: string[]) => {
      console.log(districtNames);
      const response = await districtApi.initUnlockDistrict(districtNames);
      return response;
    },
    onSuccess: async () => {
      toast.success('지역구 선택이 완료되었습니다!');
      clearSelectedDistricts();
      
      // 지역락 완료 후 상태를 GET으로 확인
      try {
        const statusResponse = await authApi.getStatus();
        const userStatus = statusResponse.data.status;
        console.log("[DistrictCheck] User status after district lock:", userStatus);
        
        // auth store 업데이트
        setPermissionLevel(userStatus as "ONBOARDING_REQUIRED" | "COUPLE_MATCHING_REQUIRED" | "ROCK_REQUIRED" | "COMPLETED");
        
        // 상태에 따라 적절한 페이지로 리다이렉트
        redirectBasedOnStatus(userStatus, navigate);
      } catch (error) {
        console.error("[DistrictCheck] Failed to get user status:", error);
        // 상태 확인 실패 시 기본값으로 리다이렉트
        navigate('/home');
      }
    },
    onError: (error: any) => {
      console.error('지역구 선택 확인 실패:', error);
      toast.error('지역구 선택 확인에 실패했습니다.');
      setIsSubmitting(false);
    },
  });

  const handleConfirm = async () => {
    if (selectedDistricts.length !== 2) {
      toast.error('2개의 자치구를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    const districtNames = selectedDistricts.map(district => district.name);
    confirmDistrictMutation.mutate(districtNames);
  };

  const handleBack = () => {
    navigate('/district/choose');
  };

  if (selectedDistricts.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="h-[800px] w-[700px] bg-[#DED6D6] border-gray-300 border rounded-2xl p-4 py-16 flex flex-col gap-4 justify-center items-center">
          <h1 className="text-2xl font-bold text-gray-800">선택된 자치구가 없습니다</h1>
          <p className="text-gray-600">자치구를 다시 선택해주세요.</p>
          <button
            onClick={handleBack}
            className="w-[220px] h-[44px] bg-primary text-white rounded-md hover:bg-primary/80 transition-all duration-200"
          >
            자치구 선택하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative h-[800px] w-[700px] bg-[#DED6D6] border-gray-300 border rounded-2xl p-4 py-16 flex flex-col gap-4 justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-900">데이트 지역 확인</h1>
        <p className="text-gray-700 text-center">다음 2개의 자치구에서 데이트 코스를 추천받으시겠습니까?</p>
        {/* 배경 이미지 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${namsantower})` }}
        />
        {/* 선택된 자치구 목록 */}
        <div className="w-full max-w-md space-y-4 relative z-10">
          {selectedDistricts.map((district, index) => (
            <div
              key={district.name}
              className="bg-white border border-gray-300 rounded-lg p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <FontAwesomeIcon 
                  icon={faCheck} 
                  className="w-5 h-5 text-primary" 
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{district.name}</h3>
                {district.description && (
                  <p className="text-sm text-gray-600">{district.description}</p>
                )}
              </div>
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{index + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 확인 메시지 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full max-w-md relative z-10">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              선택한 2개 자치구를 기반으로 맞춤형 데이트 코스를 추천해드립니다.
            </p>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-4 w-full max-w-md relative z-10">
          <button
            onClick={handleBack}
            disabled={isSubmitting}
            className="flex-1 h-[44px] bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            다시 선택
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 h-[44px] bg-[#662B2B] text-white rounded-md hover:bg-primary/80 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span>확인 중...</span>
              </>
            ) : (
              <>
                <span>확인</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};