// 코스 조회 가능한 사이드바

// import { usePlaceStore } from "../../shared/store/mapbox.store";
import { useNavigate } from "react-router-dom";
import course from "../mocks/course.json";
import courseList from "../mocks/getCourse.json";
import { useParams, useLocation } from "react-router-dom";

export const CourseDetailSidebar = () => {
  // const { setIsPlace } = usePlaceStore();
  const navigate = useNavigate();
  let { id } = useParams();
  const { pathname } = useLocation();
  let pathType = "";
  let path = "";

  if (pathname.includes("recommend")) {
    pathType = "recommend";
    path = `${pathType}/course`;
  } else {
    pathType = "course";
    path = `${pathType}/${id}/place`;
  };
  // 정렬 후 출력
  const mockCourse = courseList.find((item) => item.courseId === 4) ?? courseList[0];
  const sortedStops = [...mockCourse.poiList].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col items-start gap-8 p-4 h-full relative">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold">추천 코스</h1>
        <p className="text-gray-500 text-sm">{course.items[0].route_id}</p>
      </div>
      <div className="flex flex-col w-full gap-2 items-start">
        {
          sortedStops.map((item) => (
            <div key={item.poiSetId} className="flex w-full items-center gap-4 cursor-pointer hover:bg-gray-100 p-2" onClick={() => {navigate(`/${path}/${item.poi?.poiId}`)}}>
              <div className="flex items-center gap-2">
                <div className="w-[32px] h-[32px] bg-black text-white rounded-full flex items-center justify-center">{item.order}</div>
              </div>
              <div>
                <h2>{item.poi?.name}</h2>
                <p className="text-gray-500 text-sm">{item.poi?.category}</p>
                <p className="text-gray-500 text-sm">이유 또는 설명을 넣는 곳 인데 </p>
                <p className="text-gray-500 text-sm">예상 시간 60 분</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};
