export enum RecommendCategory {
  CAFE = "CAFE",
  PARK = "PARK",
  RESTAURANT = "RESTAURANT",
  MUSEUM = "MUSEUM",
  BAR = "BAR",
  SHOP = "SHOP",
  HOTEL = "HOTEL",
  LIBRARY = "LIBRARY",
  GALLERY = "GALLERY",
  OTHER = "OTHER",
}

export type RecommendPoiItem = {
  seq: number;
  name: string;
  category: RecommendCategory;
  lat: number;
  lng: number;
  indoor: boolean;
  priceLevel: number;
  openHours: Record<string, string>;
  alcohol: number;
  moodTag: string;
  foodTag: string[];
  ratingAvg: number;
  link: string;
};

export type RecommendCoursePayload = {
  title: string;
  explain: string;
  data: RecommendPoiItem[];
};
