// 장소 조회 가능한 사이드바

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Course, CoursePoiSet } from "../types";  
import DEFAULT_COURSES from "../mocks/getCourse.json";

const COURSE_STORAGE_KEY = "pitterpetter:courses";

// 모든 옵션이 채워진 데이터와 옵션이 없는 데이터를 모두 제공해 비교하기 쉽게 구성

const isBrowser = typeof window !== "undefined";

const isCourseArray = (value: unknown): value is Course[] => {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) => {
    return (
      item &&
      typeof item === "object" &&
      "poi_list" in item &&
      Array.isArray((item as Course).poi_list)
    );
  });
};

// 여기 세션으로 바꾸기 
const readCoursesFromStorage = (): Course[] => {
  if (!isBrowser) {
    return DEFAULT_COURSES;
  }

  const storedValue = window.sessionStorage.getItem(COURSE_STORAGE_KEY);

  if (!storedValue) {
    window.sessionStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(DEFAULT_COURSES.courses));
    return DEFAULT_COURSES.courses;
  }

  try {
    const parsed = JSON.parse(storedValue);
    if (isCourseArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.warn("Failed to parse stored course data:", error);
  }

  window.sessionStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(DEFAULT_COURSES));
  return DEFAULT_COURSES;
};

const formatDecimal = (value: number) => {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
};

const formatPriceLevel = (level: number) => {
  if (!Number.isFinite(level) || level <= 0) {
    return "정보 없음";
  }

  const normalized = Math.max(1, Math.min(4, Math.round(level)));
  return "₩".repeat(normalized);
};

const matchesCandidate = (candidate: unknown, target: string) => {
  if (!target || candidate === undefined || candidate === null) {
    return false;
  }

  return candidate.toString().toLowerCase() === target;
};

type CoursePoi = {
  course: Course;
  poiSet: CoursePoiSet;
};

export const PlaceDetailSidebar = () => {
  const { id: placeId } = useParams();
  const [courses, setCourses] = useState<Course[]>(() => readCoursesFromStorage());

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== COURSE_STORAGE_KEY) {
        return;
      }

      if (!event.newValue) {
        setCourses(DEFAULT_COURSES);
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue);
        if (isCourseArray(parsed)) {
          setCourses(parsed);
        }
      } catch (error) {
        console.warn("Failed to sync course data from storage:", error);
        setCourses(DEFAULT_COURSES);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
    } catch (error) {
      console.warn("Failed to persist course data:", error);
    }
  }, [courses]);

  const poisWithCourse = useMemo<CoursePoi[]>(() => {
    return courses.flatMap((course) =>
      course.poi_list.map((poiSet) => ({
        course,
        poiSet,
      }))
    );
  }, [courses]);

  const normalizedTarget = (placeId ?? "").toString().trim().toLowerCase();

  const matchedEntry = useMemo(() => {
    if (!normalizedTarget) {
      return null;
    }

    return (
      poisWithCourse.find(({ poiSet }) => {
        const { poi } = poiSet;

        return (
          matchesCandidate(poiSet.poi_set_id, normalizedTarget) ||
          matchesCandidate(poi.poi_id, normalizedTarget) ||
          matchesCandidate(poi.name, normalizedTarget) ||
          matchesCandidate(poiSet.order, normalizedTarget)
        );
      }) ?? null
    );
  }, [normalizedTarget, poisWithCourse]);

  const resolvedEntry = matchedEntry ?? poisWithCourse[0] ?? null;
  const usingFallback = Boolean(normalizedTarget) && matchedEntry === null && resolvedEntry !== null;

  if (!resolvedEntry) {
    return (
      <div className="flex h-full items-center justify-center bg-white px-8 text-center text-sm text-gray-500">
        저장된 장소 데이터가 없습니다.
      </div>
    );
  }

  const { course, poiSet } = resolvedEntry;
  const { poi } = poiSet;

  const stats: { label: string; value: string }[] = [];

  const infoRows: { label: string; value: string }[] = [];

  if (poi.category) {
    infoRows.push({ label: "카테고리", value: poi.category });
  }

  if (typeof poi.indoor === "boolean") {
    infoRows.push({ label: "공간", value: poi.indoor ? "실내" : "실외" });
  }

  if (typeof poi.price_level === "number" && poi.price_level > 0) {
    infoRows.push({ label: "가격대", value: formatPriceLevel(poi.price_level) });
  }

  if (poi.mood_tag !== undefined && poi.mood_tag !== null) {
    infoRows.push({ label: "무드", value: `#${poi.mood_tag}` });
  }

  if (poi.lat !== undefined && poi.lng !== undefined) {
    infoRows.push({ label: "좌표", value: `${poi.lat.toFixed(5)}, ${poi.lng.toFixed(5)}` });
  }

  if (poi.alcohol !== undefined && poi.alcohol !== null) {
    const supportsAlcohol = typeof poi.alcohol === "number" ? poi.alcohol > 0 : Boolean(poi.alcohol);
    infoRows.push({ label: "주류", value: supportsAlcohol ? "주류 제공" : "주류 미제공" });
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Course</p>
        <h2 className="mt-1 text-2xl font-semibold text-gray-900">{course.title}</h2>
        {course.info ? <p className="mt-2 text-sm text-gray-600">{course.info}</p> : null}
        {usingFallback ? (
          <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            요청한 장소 정보를 찾을 수 없어 첫 번째 장소를 보여드리고 있어요.
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="rounded-3xl border border-gray-100 bg-white shadow-md">
          <div className="border-b border-gray-100 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Place</p>
            <h3 className="mt-2 text-xl font-bold text-gray-900">{poi.name}</h3>
            {poi.category ? <p className="text-sm text-gray-500">{poi.category}</p> : null}
          </div>

          {stats.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 px-6 py-5 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-gray-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="space-y-6 px-6 py-5">
            {infoRows.length > 0 ? (
              <div className="space-y-3">
                {infoRows.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">{row.label}</span>
                    <span className="truncate text-right font-medium text-gray-800">{row.value}</span>
                  </div>
                ))}
              </div>
            ) : null}

            {poi.food_tag && poi.food_tag.length > 0 ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Food Tags</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {poi.food_tag.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {poi.open_hours ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Open Hours</p>
                <div className="mt-2 space-y-2">
                  {Object.entries(poi.open_hours).map(([day, hours]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2 text-sm text-gray-700"
                    >
                      <span className="font-medium uppercase text-gray-500">{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {poi.link ? (
              <div>
                <a
                  href={poi.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  상세 정보 보러가기
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
