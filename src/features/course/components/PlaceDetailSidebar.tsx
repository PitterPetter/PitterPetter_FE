// 장소 조회 가능한 사이드바

import { useParams } from "react-router-dom";
import course from "../mocks/course.json";

export const PlaceDetailSidebar = () => {
  // ID를 기반으로 데이터 조회?
  const { id } = useParams();
  const stop = course.items[0].stops.find((stop) => stop.id === id);
  return (
    <div className="flex flex-col items-start gap-2 p-8 h-full relative">
      <div className="bg-gray-900 text-white w-full h-[50px] flex items-center justify-center rounded-3xl">{stop?.name}</div>
      <div className="flex gap-2 w-full justify-end px-8">
        <p>예상 시간: {stop?.stay_min}분</p>
      </div>
      <div className="flex flex-col gap-2">
        <p>{stop?.reason}</p>
      </div>
    </div>
  );
};