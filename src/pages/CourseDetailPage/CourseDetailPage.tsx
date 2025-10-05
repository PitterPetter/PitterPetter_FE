// 코스 상세 페이지 (Mapbox 페이지 + 코스 & 장소 목록 페이지)

import { useLocation } from "react-router-dom";
import { RecommendMapbox } from "../../features/mapbox";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import courseList from "../../features/course/mocks/courseList.json";
import { PlaceDetailModal } from "../../features/course";
import { useEffect, useState } from "react";
import { CourseDetailSidebar } from "../../features/course";

export const CourseDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const courseData = courseList.data.reviews.find((item) => item.id === id); // ID 기반으로 찾기 (추후에 API 연동 시 수정)
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);

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
      <RecommendMapbox courseData={courseData} />
      {/* url에 따라 컴포넌트 변경 */}
      <div className="min-w-[380px] z-10 relative">
        <CourseDetailSidebar />

        <div className="absolute bottom-20 left-0 w-full flex flex-col gap-2 p-4">
          {/* <div className="flex gap-2 w-full h-[50px] justify-between">
            <Button variant="outlined" className="w-full" onClick={() => {navigate("/options")}}>Back to Options</Button>
            <Button variant="outlined" className="w-full">Rerecommend</Button>
          </div> */}
          <Button variant="contained" className="w-full h-[50px]" onClick={() => {navigate("/course")}}>추억 블로그로 돌아가기</Button>
          <Button variant="contained" className="w-full h-[50px]" onClick={() => {navigate("/diary/create")}}>다이어리 작성하러 가기</Button>
        </div>
      </div>
      
      {/* 장소 상세 모달 */}
      <PlaceDetailModal 
        isOpen={isPlaceModalOpen} 
        onClose={handleClosePlaceModal} 
      />

    </div>  
  );
};