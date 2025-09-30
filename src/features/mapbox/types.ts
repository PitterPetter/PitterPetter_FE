import type { Map as MapboxMap } from 'mapbox-gl';

export interface MarkerData {
  id: string;
  coordinates: [number, number];
  title?: string;
  description?: string;
}

export interface MapboxProps {
  center?: [number, number];
  zoom?: number;
  pitch?: number;
  markers?: MarkerData[];
  onMapClick?: (coordinates: [number, number]) => void;
  onMarkerClick?: (marker: MarkerData) => void;
  courseData?: any;
}

export interface MapRefs {
  container: HTMLDivElement | null;
  map: MapboxMap | null;
}

export interface RouteSegment {
  from: string;
  to: string;
  distance: number;
  duration: number;
}

export interface Course {
  id: string;
  name: string;
  score: number;
}

export interface InputData {
  seq: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  indoor: boolean;
  price_level?: number;
  open_hours?: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
  alcohol?: number;
  mood_tag: number;
  food_tag?: string[];
  rating_avg?: number;
  link?: string;
}

// 백엔드 추천 API 응답 타입
export interface RecommendResponse {
  explain: string;
  data: InputData[];
}