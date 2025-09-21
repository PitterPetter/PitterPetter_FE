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

export interface Stop {
  id: string | number;
  name: string;
  lat: number;
  lng: number;
  stay_min: number;
  reason: string;
  seq: number;
}