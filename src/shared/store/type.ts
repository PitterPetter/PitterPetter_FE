// MarkerStore
export interface MarkerStore {
  isMarkers: boolean;
  setIsMarkers: (value: boolean) => void;
}
export interface PlaceStore {
  isPlace: boolean;
  setIsPlace: (value: boolean) => void;
}

// UIStore
export type UIState = {
  isMapReady: boolean;
  setMapReady: (v: boolean) => void;
}

// RecommendStore
export type start = {
  lat: number;
  lng: number;
}

export type Place = {
  seq: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  indoor: boolean;
  price_level?: number;
  open_hours?: {
    mon?: string;
    tue?: string;
    wed?: string;
    thu?: string;
    fri?: string;
    sat?: string;
    sun?: string;
  };
  alcohol?: number;
  mood_tag: number;
  food_tag?: string[];
  rating_avg?: number;
  link?: string;
};

export type RecommendStore = {
  explain: string;
  data: Place[];
};
