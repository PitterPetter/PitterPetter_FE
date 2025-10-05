// 장소 조회 가능한 사이드바

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Course, CoursePoiSet } from "../types";
import courseMock from "../mocks/getCourse.json";

const COURSE_STORAGE_KEY = "pitterpetter:courses";
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

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const asNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const asString = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return undefined;
};

const asStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const result = value.filter((item): item is string => typeof item === "string");
  return result.length > 0 ? result : [];
};

const asRecordOfStrings = (value: unknown): Record<string, string> | undefined => {
  if (!isPlainObject(value)) {
    return undefined;
  }

  const entries = Object.entries(value).map(([key, val]) => [key, asString(val) ?? ""]);
  return Object.fromEntries(entries);
};

const toPoiDetail = (candidate: unknown): CoursePoiSet["poi"] | null => {
  if (!isPlainObject(candidate)) {
    return null;
  }

  const lat = asNumber(candidate.lat);
  const lng = asNumber(candidate.lng);
  if (lat === undefined || lng === undefined) {
    return null;
  }

  const price = asNumber(candidate.price_level ?? candidate.priceLevel);
  const alcohol = candidate.alcohol;
  const averageRating = [
    candidate.avarage_review_score,
    candidate.average_review_score,
    candidate.ratingAvg,
  ]
    .map(asNumber)
    .find((value) => value !== undefined);

  return {
    poi_id: (candidate.poi_id ?? candidate.poiId ?? 0) as number | string,
    name: asString(candidate.name) ?? "",
    category: asString(candidate.category) ?? "",
    lat,
    lng,
    indoor: typeof candidate.indoor === "boolean" ? candidate.indoor : undefined,
    price_level: price ?? null,
    open_hours: asRecordOfStrings(candidate.open_hours ?? candidate.openHours),
    alcohol:
      typeof alcohol === "number" || typeof alcohol === "boolean" || alcohol === null
        ? alcohol
        : undefined,
    mood_tag: asString(candidate.mood_tag ?? candidate.moodTag) ?? undefined,
    food_tag: asStringArray(candidate.food_tag ?? candidate.foodTag),
    link: candidate.link === null ? null : asString(candidate.link),
    avarage_review_score: averageRating ?? undefined,
  };
};

const toCoursePoiSet = (candidate: unknown): CoursePoiSet | null => {
  if (!isPlainObject(candidate)) {
    return null;
  }

  const poi = toPoiDetail(candidate.poi);
  if (!poi) {
    return null;
  }

  return {
    poi_set_id: asNumber(candidate.poi_set_id ?? candidate.poiSetId ?? candidate.id) ?? 0,
    order: asNumber(candidate.order ?? candidate.seq) ?? 0,
    poi,
  };
};

const toCourse = (candidate: unknown): Course | null => {
  if (!isPlainObject(candidate)) {
    return null;
  }

  const rawList = Array.isArray(candidate.poi_list)
    ? candidate.poi_list
    : Array.isArray(candidate.poiList)
      ? candidate.poiList
      : [];

  const poi_list = rawList
    .map(toCoursePoiSet)
    .filter((item): item is CoursePoiSet => item !== null);

  const review = [candidate.reviewScore, candidate.score]
    .map(asNumber)
    .find((value) => value !== undefined);

  return {
    course_id: asNumber(candidate.course_id ?? candidate.courseId ?? candidate.id) ?? 0,
    title: asString(candidate.title) ?? "",
    description: asString(candidate.description) ?? "",
    reviewScore: review ?? undefined,
    poi_list,
  };
};

const normalizeCourses = (value: unknown): Course[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => toCourse(item))
    .filter((item): item is Course => item !== null);
};

const parseStoredCourses = (value: string | null): Course[] | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    if (isCourseArray(parsed)) {
      return parsed;
    }

    const normalized = normalizeCourses(parsed);
    return normalized.length > 0 ? normalized : null;
  } catch (error) {
    console.warn("Failed to parse stored course data:", error);
    return null;
  }
};

const normalizeMoodTag = (value: unknown): string | null | undefined => {
  if (value === undefined || value === null) {
    return value as null | undefined;
  }

  return value.toString();
};

const prepareCourses = (courses: Course[]): Course[] => {
  return courses.map((course) => ({
    ...course,
    poi_list: course.poi_list.map((poiSet) => ({
      ...poiSet,
      poi: {
        ...poiSet.poi,
        mood_tag: normalizeMoodTag(poiSet.poi.mood_tag),
        food_tag: Array.isArray(poiSet.poi.food_tag)
          ? [...poiSet.poi.food_tag]
          : poiSet.poi.food_tag,
        open_hours: poiSet.poi.open_hours
          ? { ...poiSet.poi.open_hours }
          : poiSet.poi.open_hours,
      },
    })),
  }));
};

const containsLegacyMoodTag = (courses: Course[]): boolean => {
  return courses.some((course) => {
    return course.poi_list.some(({ poi }) => typeof poi.mood_tag === "number");
  });
};

const mockCourses = normalizeCourses(courseMock);
const fallbackCourse = mockCourses.find((course) => course.course_id === 2);
const RAW_FALLBACK_COURSES = fallbackCourse ? [fallbackCourse] : mockCourses;
// ⭐ PlaceDetailSidebar uses only the "mock" course with `course_id: 2`
const FALLBACK_COURSES = prepareCourses(RAW_FALLBACK_COURSES);
const FALLBACK_SIGNATURE = JSON.stringify(FALLBACK_COURSES);

const matchesFallbackSignature = (courses: Course[]): boolean => {
  return JSON.stringify(prepareCourses(courses)) === FALLBACK_SIGNATURE;
};

const courseStorage = {
  read(): Course[] {
    if (!isBrowser) {
      return prepareCourses(FALLBACK_COURSES);
    }

    const parsed = parseStoredCourses(window.sessionStorage.getItem(COURSE_STORAGE_KEY));
    if (parsed) {
      if (containsLegacyMoodTag(parsed) || !matchesFallbackSignature(parsed)) {
        courseStorage.write(FALLBACK_COURSES);
        return FALLBACK_COURSES;
      }

      return prepareCourses(parsed);
    }

    courseStorage.write(FALLBACK_COURSES);
    return FALLBACK_COURSES;
  },
  write(courses: Course[]) {
    if (!isBrowser) {
      return;
    }

    try {
      window.sessionStorage.setItem(
        COURSE_STORAGE_KEY,
        JSON.stringify(prepareCourses(courses))
      );
    } catch (error) {
      console.warn("Failed to persist course data:", error);
    }
  },
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

const MAX_STAR_RATING = 5;

const clampRating = (value: number) => {
  return Math.max(0, Math.min(MAX_STAR_RATING, value));
};

const renderStarRating = (rating: number) => {
  const clamped = clampRating(rating);
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
      <span className="text-sm text-gray-500">{formatDecimal(clamped)}</span>
    </div>
  );
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

type CoursePoi = {
  course: Course;
  poiSet: CoursePoiSet;
};

type StatRow = {
  label: string;
  rating: number;
};

type DetailRow = {
  label: string;
  value: string;
};

const buildPlaceStats = (course: Course, poi: CoursePoiSet["poi"]): StatRow[] => {
  const stats: StatRow[] = [];

  if (typeof course.reviewScore === "number" && course.reviewScore > 0) {
    stats.push({ label: "00님의 평가", rating: course.reviewScore });
  }

  return stats;
};

const buildInfoRows = (poi: CoursePoiSet["poi"]): DetailRow[] => {
  const rows: DetailRow[] = [];

  if (poi.category) {
    rows.push({ label: "카테고리", value: poi.category });
  }

  if (typeof poi.indoor === "boolean") {
    rows.push({ label: "공간", value: poi.indoor ? "실내" : "실외" });
  }

  if (typeof poi.price_level === "number" && poi.price_level > 0) {
    rows.push({ label: "가격대", value: formatPriceLevel(poi.price_level) });
  }

  if (poi.mood_tag !== undefined && poi.mood_tag !== null && poi.mood_tag !== "") {
    rows.push({ label: "무드", value: `#${poi.mood_tag}` });
  }

  if (poi.alcohol !== undefined && poi.alcohol !== null) {
    const supportsAlcohol = typeof poi.alcohol === "number" ? poi.alcohol > 0 : Boolean(poi.alcohol);
    rows.push({ label: "주류", value: supportsAlcohol ? "주류 제공" : "주류 미제공" });
  }

  return rows;
};

const findEntryByTarget = (entries: CoursePoi[], target: string): CoursePoi | null => {
  if (!target) {
    return null;
  }

  return (
    entries.find(({ poiSet }) => {
      const { poi } = poiSet;

      return (
        matchesCandidate(poiSet.poi_set_id, target) ||
        matchesCandidate(poi.poi_id, target) ||
        matchesCandidate(poi.name, target) ||
        matchesCandidate(poiSet.order, target)
      );
    }) ?? null
  );
};

export const PlaceDetailSidebar = () => {
  const { id: placeId } = useParams();
  const [courses, setCourses] = useState<Course[]>(() => courseStorage.read());

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== COURSE_STORAGE_KEY) {
        return;
      }

      const parsed = parseStoredCourses(event.newValue);

      if (parsed) {
        if (containsLegacyMoodTag(parsed) || !matchesFallbackSignature(parsed)) {
          courseStorage.write(FALLBACK_COURSES);
          setCourses(FALLBACK_COURSES);
          return;
        }

        setCourses(prepareCourses(parsed));
        return;
      }

      courseStorage.write(FALLBACK_COURSES);
      setCourses(FALLBACK_COURSES);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    courseStorage.write(courses);
  }, [courses]);

  const poisWithCourse = useMemo<CoursePoi[]>(() => {
    return courses.flatMap((course) =>
      course.poi_list.map((poiSet) => ({
        course,
        poiSet,
      }))
    );
  }, [courses]);

  const normalizedTarget = normalizeText(placeId);

  const matchedEntry = useMemo(() => {
    return findEntryByTarget(poisWithCourse, normalizedTarget);
  }, [normalizedTarget, poisWithCourse]);

  const resolvedEntry = matchedEntry ?? poisWithCourse[0] ?? null;

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
