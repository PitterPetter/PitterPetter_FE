import React, { useState } from 'react';
import { Place } from '../../../shared/store/type';
import { loadRecommendFromSession } from '../../recommend/utils/sessionStorage';
import { loadOptionFromSession } from '../../option/utils/sessionStorage';
import { SessionCoursesModalProps } from '../types';
import { rerecommendCourseApi } from '../api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const SessionCoursesModal: React.FC<SessionCoursesModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const sessionData = loadRecommendFromSession();
  const places: Place[] = sessionData?.data || [];
  const [selectedPlaces, setSelectedPlaces] = useState<Set<number>>(new Set());

  const rerecommendCourseMutation = useMutation({
    mutationFn: rerecommendCourseApi,
    onSuccess: (response) => {
      console.log('API 응답:', response);
      const data = response.data;
      console.log('추출된 데이터:', data);
      toast.success("재추천 받기 성공");
      onSuccess?.(data);
      navigate('/recommend');
      onClose();
    },
    onError: () => {
      toast.error("재추천 받기에 실패했습니다.");
    },
  });

  const formatCategory = (category?: string) => (category ? category.toUpperCase() : "UNKNOWN");

  const handlePlaceClick = (seq: number) => {
    setSelectedPlaces(prev => {
      const newSet = new Set(prev);
      if (newSet.has(seq)) {
        newSet.delete(seq);
      } else {
        newSet.add(seq);
      }
      return newSet;
    });
  };

  const handleRerecommend = () => {
    // 옵션 데이터 로드
    const optionData = loadOptionFromSession();
    
    // 재추천 API에 필요한 데이터 구성
    const requestData = {
      exclude_pois: places.filter(place => selectedPlaces.has(place.seq)),
      previous_recommendations: places,
      user_choice: optionData?.user_choice || {}
    };

    console.log('재추천 요청 데이터:', requestData);
    rerecommendCourseMutation.mutate(requestData);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Rerecommend</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {places.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              저장된 추천 코스가 없습니다.
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto h-full max-h-[350px]">
              {places.map((place, index) => {
                const isSelected = selectedPlaces.has(place.seq);
                return (
                  <div
                    key={`${place.seq}-${index}`}
                    className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                      isSelected 
                        ? "bg-[#662B2B] text-white border-[#662B2B]" 
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handlePlaceClick(place.seq)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                        isSelected ? "bg-white text-[#662B2B]" : "bg-[#662B2B] text-white"
                      }`}>
                        {place.seq}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-medium truncate ${
                          isSelected ? "text-white" : "text-[#662B2B]"
                        }`}>
                          {place.name}
                        </h3>
                        <p className={`text-sm font-semibold uppercase tracking-wide mt-1 ${
                          isSelected ? "text-white" : "text-[#1F2937]"
                        }`}>
                          {formatCategory(place.category)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-8">
            <p className="text-sm text-gray-600">
              재추천 받을 장소를 선택해주세요
            </p>
            <button className="bg-[#662B2B] text-white w-full py-3 rounded-md" onClick={handleRerecommend}>
              재추천 받기
            </button>
          </div>
        </div>

        {/* 푸터 */}
        <div className="border-t p-4">
        </div>
      </div>
    </div>
  );
};
