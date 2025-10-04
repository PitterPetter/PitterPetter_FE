export type Course = {
  course_id: number;
  couple_id: number;
  title: string;
  description: string;
  reviewScore?: number;
  poi_list: CoursePoiSet[];
};

export type CoursePoiSet = {
  poi_set_id: number;
  order: number;
  rating?: number | null;
  poi: PoiDetail;
};

export type PoiDetail = {
  poi_id: number | string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  indoor?: boolean;
  price_level?: number | null;
  open_hours?: Record<string, string>;
  alcohol?: number | boolean | null;
  mood_tag?: string | null;
  food_tag?: string[];
  link?: string | null;
};
