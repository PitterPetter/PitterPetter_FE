import { create } from 'zustand';

interface MarkerStore {
  isMarkers: boolean;
  setIsMarkers: (value: boolean) => void;
}

export const useMarkerStore = create<MarkerStore>((set) => ({
  isMarkers: false,
  setIsMarkers: (value) => set({ isMarkers: value }),
}));
