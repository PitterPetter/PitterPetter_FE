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
}

export interface MapRefs {
  container: HTMLDivElement | null;
  map: MapboxMap | null;
}

export interface RecommendCourseSidebarProps {
  setIsPlace: (isPlace: boolean) => void;
}

export interface RecommendPlaceSidebarProps {
  setIsPlace: (isPlace: boolean) => void;
}