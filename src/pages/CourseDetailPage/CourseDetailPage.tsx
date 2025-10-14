// 코스 상세 페이지 (Mapbox 페이지 + 코스 & 장소 목록 페이지)

import { useLocation } from "react-router-dom";
import { RecommendMapbox } from "../../features/mapbox";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import courseList from "../../features/course/mocks/courseList.json";
import { PlaceDetailModal } from "../../features/course";
import { useEffect, useState, useMemo } from "react";
import { CourseDetailSidebar } from "../../features/course";
import { COURSE_STORAGE_KEY, readCoursesFromSession } from "../../features/course/utils/normalizeCourse";
import { useRecommendStore } from "../../shared/store/recommend.store";
import type { Course } from "../../features/course/types";

export const CourseDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const { setRecommend } = useRecommendStore();
  
  // 세션에서 코스 데이터 가져오기
  const courses = useMemo(() => readCoursesFromSession(), []);
  const currentCourse = useMemo(() => {
    if (!id) return null;
    const courseId = parseInt(id);
    return courses.find(course => course.course_id === courseId);
  }, [courses, id]);

  // 코스 데이터를 RecommendStore에 설정
  useEffect(() => {
    if (currentCourse && currentCourse.poi_list) {
      const mapData = currentCourse.poi_list.map((poiSet, index) => ({
        id: poiSet.poi.poi_id,
        name: poiSet.poi.name,
        category: poiSet.poi.category,
        lat: poiSet.poi.lat,
        lng: poiSet.poi.lng,
        seq: poiSet.order,
        indoor: poiSet.poi.indoor ?? false,
        price_level: poiSet.poi.price_level ?? undefined,
        alcohol: typeof poiSet.poi.alcohol === 'number' ? poiSet.poi.alcohol : undefined,
        mood_tag: poiSet.poi.mood_tag ? parseInt(poiSet.poi.mood_tag) : 0,
      }));

      setRecommend({
        explain: currentCourse.description || "코스 상세 정보",
        data: mapData,
      });
    }
  }, [currentCourse?.course_id]); // course_id만 의존성으로 설정

  useEffect(() => {
    const isPlaceRoute = location.pathname.includes('/place/');
    setIsPlaceModalOpen(isPlaceRoute);
  }, [location.pathname]);

  const handleClosePlaceModal = () => {
    setIsPlaceModalOpen(false);
    navigate(`/course/${id}`);
  };

  return (
    <div className="flex absolute left-0 top-0 w-full h-full">
      <RecommendMapbox courseData={currentCourse} />
      {/* url에 따라 컴포넌트 변경 */}
      <div className="w-[28.57vw] min-w-[320px] z-10 relative">
        <CourseDetailSidebar />
      </div>
      
      {/* 장소 상세 모달 */}
      <PlaceDetailModal 
        isOpen={isPlaceModalOpen} 
        onClose={handleClosePlaceModal} 
      />

    </div>  
  );
};
