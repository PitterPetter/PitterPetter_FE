import { create } from 'zustand';
import { MarkerStore, PlaceStore, DistrictStore } from './type';

export const useMarkerStore = create<MarkerStore>((set) => ({
  isMarkers: false,
  setIsMarkers: (value) => set({ isMarkers: value }),
}));

export const usePlaceStore = create<PlaceStore>((set) => ({
  isPlace: false,
  setIsPlace: (value) => set({ isPlace: value }),
}));

export const useDistrictStore = create<DistrictStore>((set) => ({
  district: null,
  setDistrict: (value) => set({ district: value }),
}));