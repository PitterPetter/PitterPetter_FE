import type { Course, CoursePoiSet } from "../types";

export const COURSE_STORAGE_KEY = "pitterpetter:courses";

export const normalizeCourses = (rawCourses: unknown): Course[] => {
  if (!Array.isArray(rawCourses)) {
    return [];
  }

  return rawCourses
    .map((candidate) => normalizeCourse(candidate))
    .filter((course): course is Course => course !== null);
};

const normalizeCourse = (candidate: unknown): Course | null => {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const raw = candidate as Record<string, unknown>;

  const poi_list = Array.isArray(raw.poiList) ? raw.poiList : Array.isArray(raw.poi_list) ? raw.poi_list : [];

  const normalizedPoiList = poi_list
    .map((item) => normalizeCoursePoiSet(item))
    .filter((poiSet): poiSet is CoursePoiSet => poiSet !== null)
    .sort((a, b) => a.order - b.order);

  const courseId = asNumber(raw.course_id ?? raw.courseId ?? raw.id);
  const title = asString(raw.title);
  const description = asString(raw.description);

  if (courseId === undefined || title === undefined || description === undefined) {
    return null;
  }

  return {
    course_id: courseId,
    title,
    description,
    reviewScore: asNumber(raw.reviewScore ?? raw.score) ?? undefined,
    poi_list: normalizedPoiList,
  };
};

const normalizeCoursePoiSet = (candidate: unknown): CoursePoiSet | null => {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const raw = candidate as Record<string, unknown>;
  const poi = normalizePoi(raw.poi);
  if (!poi) {
    return null;
  }

  return {
    poi_set_id: asNumber(raw.poi_set_id ?? raw.poiSetId ?? raw.id) ?? 0,
    order: asNumber(raw.order ?? raw.seq) ?? 0,
    poi,
  };
};

const normalizePoi = (candidate: unknown): CoursePoiSet["poi"] | null => {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const raw = candidate as Record<string, unknown>;
  const lat = asNumber(raw.lat);
  const lng = asNumber(raw.lng);

  if (lat === undefined || lng === undefined) {
    return null;
  }

  const priceLevel = asNumber(raw.priceLevel ?? raw.price_level);
  const alcohol = raw.alcohol;
  const rating = asNumber(raw.ratingAvg ?? raw.avarage_review_score);

  return {
    poi_id: (raw.poi_id ?? raw.poiId ?? raw.id ?? 0) as number | string,
    name: asString(raw.name) ?? "",
    category: asString(raw.category) ?? "",
    lat,
    lng,
    indoor: typeof raw.indoor === "boolean" ? raw.indoor : undefined,
    price_level: priceLevel ?? null,
    open_hours: asRecordOfStrings(raw.open_hours ?? raw.openHours),
    alcohol:
      typeof alcohol === "number" || typeof alcohol === "boolean" || alcohol === null
        ? alcohol
        : undefined,
    mood_tag: asString(raw.mood_tag ?? raw.moodTag) ?? undefined,
    food_tag: asStringArray(raw.food_tag ?? raw.foodTag),
    link: raw.link === null ? null : asString(raw.link),
    avarage_review_score: rating ?? undefined,
  };
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
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const entries = Object.entries(value).map(([key, val]) => [key, asString(val) ?? ""]);
  return Object.fromEntries(entries);
};
