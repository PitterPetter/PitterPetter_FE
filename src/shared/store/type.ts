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
