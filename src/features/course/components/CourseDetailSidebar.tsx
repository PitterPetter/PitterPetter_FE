// 코스 조회 가능한 사이드바

// import { usePlaceStore } from "../../shared/store/mapbox.store";
import { useNavigate } from "react-router-dom";
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
    <div className="flex flex-col h-full gap-8 p-6 bg-white">
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-2xl font-semibold text-[#0B0B0C]">{mockCourse.title}</h1>
        <p className="text-base text-[#6B7486]">{mockCourse.description}</p>
      </div>
      <div className="w-full h-px bg-gray-200" />
      <div className="flex flex-col w-full">
        {
          sortedStops.map((item, index) => (
            <div
              key={item.poiSetId}
              className="flex flex-col gap-3 py-5 cursor-pointer transition-colors hover:bg-gray-50 px-2 -mx-2"
              onClick={() => {navigate(`/${path}/${item.poi?.poiId}`);}}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#662B2B] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {item.order}
                </div>
                <span className="text-[#662B2B] text-lg font-medium">{item.poi?.name}</span>
              </div>
              <div className="flex flex-col gap-2 pl-[44px]">
                <p className="text-sm text-[#1F2937] font-semibold uppercase tracking-wide">{item.poi?.category}</p>
                <p className="text-sm text-gray-500">이유 또는 설명을 넣는 곳인데, 추천 이유가 들어갈 자리입니다.</p>
                <p className="text-sm text-gray-400">예상 시간 60분 · 이동 거리 정보가 들어갑니다.</p>
              </div>
              {index !== sortedStops.length - 1 && <div className="w-full h-px bg-gray-200" />}
            </div>
          ))
        }
      </div>
    </div>
  );
};
