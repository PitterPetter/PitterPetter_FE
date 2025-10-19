// 장소 조회 가능한 사이드바

import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import type { Course, CoursePoiSet } from "../types";
import { COURSE_STORAGE_KEY, readCoursesFromSession } from "../utils/normalizeCourse";

const isBrowser = typeof window !== "undefined";

type CoursePoi = {
  course: Course;
  poiSet: CoursePoiSet;
};

type NavigationState = {
  courseId?: number | string;
  poiSetId?: number | string;
  poiId?: number | string;
};

type StatRow = {
  label: string;
  rating: number;
};

type DetailRow = {
  label: string;
  value: string;
};

const normalizeText = (candidate: unknown) => {
  if (candidate === undefined || candidate === null) {
    return "";
  }

  return candidate.toString().trim().toLowerCase();
};

const matchesCandidate = (candidate: unknown, target: string) => {
  if (!target) {
    return false;
  }

  return normalizeText(candidate) === target;
};

const buildPlaceStats = (course: Course, poi: CoursePoiSet["poi"]): StatRow[] => {
  const stats: StatRow[] = [];

  if (typeof course.reviewScore === "number" && course.reviewScore > 0) {
    stats.push({ label: "00님의 평가", rating: course.reviewScore });
  }

  return stats;
};

const formatPriceLevel = (level: number) => {
  if (!Number.isFinite(level) || level <= 0) {
    return "정보 없음";
  }

  const normalized = Math.max(1, Math.min(4, Math.round(level)));
  return "₩".repeat(normalized);
};

const buildInfoRows = (poi: CoursePoiSet["poi"]): DetailRow[] => {
  const rows: DetailRow[] = [];

  if (poi.category) {
    rows.push({ label: "카테고리", value: poi.category });
  }

  if (typeof poi.indoor === "boolean") {
    rows.push({ label: "공간", value: poi.indoor ? "실내" : "실외" });
  }

  if (poi.mood_tag) {
    rows.push({ label: "무드", value: `#${poi.mood_tag}` });
  }

  if (poi.alcohol !== undefined && poi.alcohol !== null) {
    const supportsAlcohol = typeof poi.alcohol === "number" ? poi.alcohol > 0 : Boolean(poi.alcohol);
    rows.push({ label: "주류", value: supportsAlcohol ? "주류 제공" : "주류 미제공" });
  }

  return rows;
};

const renderStarRating = (rating: number) => {
  const MAX_STAR_RATING = 5;
  const clamped = Math.max(0, Math.min(MAX_STAR_RATING, rating));
  const highlighted = Math.round(clamped);

  return (
    <div className="mt-1 flex items-center gap-2">
      <div className="flex text-lg leading-none">
        {Array.from({ length: MAX_STAR_RATING }, (_, index) => (
          <span
            key={index}
            className={index < highlighted ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm text-gray-500">{clamped.toFixed(1)}</span>
    </div>
  );
};

const flattenPois = (courses: Course[]): CoursePoi[] => {
  return courses.flatMap((course) =>
    course.poi_list.map((poiSet) => ({
      course,
      poiSet,
    }))
  );
};

const findPlaceEntry = (
  entries: CoursePoi[],
  courseTargets: string[],
  poiTargets: string[]
): CoursePoi | null => {
  const courseMatch = courseTargets
    .map((target) => entries.find(({ course }) => matchesCandidate(course.course_id, target)))
    .find((candidate): candidate is CoursePoi => Boolean(candidate));

  const narrowedEntries = courseMatch
    ? entries.filter(({ course }) => course.course_id === courseMatch.course.course_id)
    : entries;

  const poiMatch = poiTargets
    .map((target) =>
      narrowedEntries.find(({ poiSet }) => {
        const { poi } = poiSet;
        return (
          matchesCandidate(poiSet.poi_set_id, target) ||
          matchesCandidate(poi.poi_id, target) ||
          matchesCandidate(poi.name, target) ||
          matchesCandidate(poiSet.order, target)
        );
      })
    )
    .find((candidate): candidate is CoursePoi => Boolean(candidate));

  if (poiMatch) {
    return poiMatch;
  }

  return narrowedEntries[0] ?? null;
};

interface PlaceDetailSidebarProps {
  placeData?: any; // 추천 장소 데이터
}

export const PlaceDetailSidebar = ({ placeData }: PlaceDetailSidebarProps) => {
  const location = useLocation();
  const { id: courseIdParam, placeId } = useParams();
  const navigationState = (location.state ?? {}) as NavigationState;
  const [courses, setCourses] = useState<Course[]>(() => readCoursesFromSession());

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== COURSE_STORAGE_KEY) {
        return;
      }

      setCourses(readCoursesFromSession());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const courseTargets = useMemo(() => {
    const targets: string[] = [];
    if (navigationState.courseId !== undefined) {
      targets.push(normalizeText(navigationState.courseId));
    }
    if (courseIdParam) {
      targets.push(normalizeText(courseIdParam));
    }
    return targets;
  }, [courseIdParam, navigationState.courseId]);

  const poiTargets = useMemo(() => {
    const targets: string[] = [];
    if (navigationState.poiSetId !== undefined) {
      targets.push(normalizeText(navigationState.poiSetId));
    }
    if (navigationState.poiId !== undefined) {
      targets.push(normalizeText(navigationState.poiId));
    }
    if (placeId) {
      targets.push(normalizeText(placeId));
    }
    return targets;
  }, [navigationState.poiId, navigationState.poiSetId, placeId]);

  const poisWithCourse = useMemo(() => flattenPois(courses), [courses]);

  const resolvedEntry = useMemo(() => {
    return findPlaceEntry(poisWithCourse, courseTargets, poiTargets);
  }, [courseTargets, poiTargets, poisWithCourse]);

  // 추천 장소 데이터가 있으면 해당 데이터를 사용
  if (placeData) {
    const formatPriceLevel = (level?: number) => {
      if (!Number.isFinite(level) || level === undefined || level <= 0) {
        return "정보 없음";
      }
      const normalized = Math.max(1, Math.min(4, Math.round(level)));
      return "₩".repeat(normalized);
    };

    const formatAlcohol = (alcohol?: boolean | 0 | 1) => {
      if (alcohol === undefined || alcohol === null) return "정보 없음";
      const supportsAlcohol = typeof alcohol === "number" ? alcohol > 0 : Boolean(alcohol);
      return supportsAlcohol ? "주류 제공" : "주류 미제공";
    };

    const formatIndoor = (indoor?: boolean) => {
      if (indoor === undefined) return "정보 없음";
      return indoor ? "실내" : "실외";
    };

    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-gray-100 px-6 py-5">
            <h3 className="mt-2 text-xl font-bold text-gray-900">{placeData.name}</h3>
            {placeData.category ? <p className="text-sm text-gray-500">{placeData.category}</p> : null}
          </div>

          <div className="space-y-6 px-6 py-5">
            <div className="space-y-3">
              {placeData.category && (
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">카테고리</span>
                  <span className="truncate text-right font-medium text-gray-800">{placeData.category}</span>
                </div>
              )}
              
              {placeData.indoor !== undefined && (
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">공간</span>
                  <span className="truncate text-right font-medium text-gray-800">{formatIndoor(placeData.indoor)}</span>
                </div>
              )}
              {placeData.seq && (
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">순서</span>
                  <span className="truncate text-right font-medium text-gray-800">{placeData.seq}번째 장소</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!resolvedEntry) {
    return (
      <div className="flex h-full items-center justify-center bg-white px-8 text-center text-sm text-gray-500">
        저장된 장소 데이터가 없습니다.
      </div>
    );
  }

  const { course, poiSet } = resolvedEntry;
  const { poi } = poiSet;
  const stats = buildPlaceStats(course, poi);
  const infoRows = buildInfoRows(poi);
  const googleRating =
    typeof poi.avarage_review_score === "number" && poi.avarage_review_score > 0
      ? poi.avarage_review_score
      : null;

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-gray-100 px-6 py-5">
          <h3 className="mt-2 text-xl font-bold text-gray-900">{poi.name}</h3>
          {poi.category ? <p className="text-sm text-gray-500">{poi.category}</p> : null}
        </div>

        {stats.length > 0 ? (
          <div className="grid w-full grid-cols-1 gap-4 px-6 py-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex w-full items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3"
              >
                <p className="flex-1 text-sm font-medium text-gray-700">{stat.label}</p>
                {renderStarRating(stat.rating)}
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

          {googleRating !== null ? (
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">구글 평점</span>
              <div className="flex-shrink-0">{renderStarRating(googleRating)}</div>
            </div>
          ) : null}

          {Array.isArray(poi.food_tag) && poi.food_tag.length > 0 ? (
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

          {poi.open_hours && Object.values(poi.open_hours).some(hours => hours !== "Not Available") ? (
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
            <div className="flex justify-end">
              <a
                href={poi.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                구글 맵으로 보기
                <span aria-hidden="true">→</span>
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
