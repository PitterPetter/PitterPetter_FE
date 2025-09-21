import { create } from 'zustand';
import { MarkerStore, PlaceStore } from './type';

export const useMarkerStore = create<MarkerStore>((set) => ({
  isMarkers: false,
  setIsMarkers: (value) => set({ isMarkers: value }),
}));

export const usePlaceStore = create<PlaceStore>((set) => ({
  isPlace: false,
  setIsPlace: (value) => set({ isPlace: value }),
}));