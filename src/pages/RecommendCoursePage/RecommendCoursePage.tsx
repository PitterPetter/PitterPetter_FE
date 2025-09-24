import { Outlet } from "react-router-dom";
import MapboxRecommendPage from "./MapboxRecommendPage";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const RecommendCoursePage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex">
      <MapboxRecommendPage />
      {/* url에 따라 컴포넌트 변경 */}
      <div className="min-w-[420px] z-10 relative">
        <Outlet />

        <div className="absolute bottom-20 left-0 w-full flex flex-col gap-2 p-4">
          <div className="flex gap-2 w-full h-[50px] justify-between">
            <Button variant="outlined" className="w-full" onClick={() => {navigate("/options")}}>Back to Options</Button>
            <Button variant="outlined" className="w-full">Rerecommend</Button> {/* 추후 추가 예정 */}
          </div>
          <Button variant="contained" className="w-full h-[50px]" onClick={() => {navigate("/course")}}>Save this course</Button>

        </div>
      </div>

    </div>  
  );
};