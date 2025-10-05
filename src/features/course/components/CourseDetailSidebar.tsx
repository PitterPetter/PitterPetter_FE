// 코스 조회 가능한 사이드바

// import { usePlaceStore } from "../../shared/store/mapbox.store";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Course, CoursePoiSet } from "../types";
import { COURSE_STORAGE_KEY, normalizeCourses } from "../utils/normalizeCourse";

const STORAGE_WARNING = "[course] 세션 스토리지에서 코스 데이터를 찾지 못했습니다.";

const parseCourseId = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const CourseDetailSidebar = () => {
  // const { setIsPlace } = usePlaceStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedRaw = sessionStorage.getItem(COURSE_STORAGE_KEY);
    if (!storedRaw) {
      console.warn(STORAGE_WARNING);
      return;
    }

    try {
      const parsed = JSON.parse(storedRaw);
      const normalized = normalizeCourses(parsed);
      if (normalized.length === 0) {
        console.warn(STORAGE_WARNING);
        return;
      }
      setCourses(normalized);
    } catch (error) {
      console.error("[course] 세션 스토리지 코스 데이터를 읽어오는 중 오류가 발생했습니다.", error);
    }
  }, []);

  const requestedCourseId = useMemo(() => parseCourseId(id), [id]);

  const activeCourse = useMemo(() => {
    if (courses.length === 0) {
      return null;
    }

    if (requestedCourseId !== undefined) {
      return courses.find((course) => course.course_id === requestedCourseId) ?? courses[0];
    }

    return courses[0];
  }, [courses, requestedCourseId]);

  const sortedStops = useMemo(() => {
    if (!activeCourse) {
      return [] as CoursePoiSet[];
    }

    return [...activeCourse.poi_list].sort((a, b) => a.order - b.order);
  }, [activeCourse]);

  const basePath = useMemo(() => {
    if (pathname.includes("recommend")) {
      return "recommend/course";
    }

    const courseIdForPath = id ?? activeCourse?.course_id?.toString();
    if (courseIdForPath) {
      return `course/${courseIdForPath}/place`;
    }

    return "course";
  }, [pathname, id, activeCourse]);

  if (!activeCourse) {
    return (
      <div className="flex h-full items-center justify-center bg-white p-6 text-sm text-gray-500">
        코스 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const handleNavigate = (stop: CoursePoiSet) => {
    navigate(`/${basePath}/${stop.poi.poi_id}`);
  };

  return (
    <div className="flex flex-col h-full gap-8 p-6 bg-white w-full">
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-2xl font-semibold text-[#0B0B0C]">{activeCourse.title}</h1>
        <p className="text-base text-[#6B7486] w-full break-words break-all px-2">{activeCourse.description}</p>
      </div>
      <div className="w-full h-px bg-gray-200" />
      <div className="flex flex-col w-full gap-2">
        {sortedStops.map((stop, index) => (
          <div
            key={stop.poi_set_id}
            className="flex w-full flex-col gap-3 py-5 cursor-pointer transition-colors hover:bg-gray-50 px-2"
            onClick={() => handleNavigate(stop)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#662B2B] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {stop.order}
              </div>
              <span className="text-[#662B2B] text-lg font-medium truncate">{stop.poi.name}</span>
            </div>
            <div className="flex flex-col gap-2 pl-[44px] w-full">
              <p className="text-sm text-[#1F2937] font-semibold uppercase tracking-wide">{stop.poi.category}</p>
              <p className="text-sm text-gray-500">이유 또는 설명을 넣는 곳인데, 추천 이유가 들어갈 자리입니다.</p>
              <p className="text-sm text-gray-400">예상 시간 60분 · 이동 거리 정보가 들어갑니다.</p>
            </div>
            {index !== sortedStops.length - 1 && <div className="w-full h-px bg-gray-200" />}
          </div>
        ))}
      </div>
    </div>
  );
};
