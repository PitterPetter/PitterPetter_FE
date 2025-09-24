// import { usePlaceStore } from "../../shared/store/mapbox.store";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import course from "../../features/Course/mocks/course.json";

export const RecommendCourseSidebar = () => {
  // const { setIsPlace } = usePlaceStore();
  const navigate = useNavigate();
  // 정렬 후 출력
  const sortedStops = [...course.items[0].stops].sort((a, b) => a.seq - b.seq);

  return (
    <div className="flex flex-col items-start gap-8 p-4 h-full relative">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold">추천 코스</h1>
        <p className="text-gray-500 text-sm">{course.items[0].route_id}</p>
      </div>
      <div className="flex flex-col w-full gap-2 items-start">
        {
          sortedStops.map((item) => (
            <div key={item.id} className="flex w-full items-center gap-4 cursor-pointer hover:bg-gray-100 p-2" onClick={() => {navigate(`/recommend/course/${item.id}`)}}>
              <div className="flex items-center gap-2">
                <div className="w-[32px] h-[32px] bg-black text-white rounded-full flex items-center justify-center">{item.seq}</div>
              </div>
              <div>
                <h2>{item.name}</h2>
                <p className="text-gray-500 text-sm">{item.reason}</p>
                <p className="text-gray-500 text-sm">예상 시간: {item.stay_min}분</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};