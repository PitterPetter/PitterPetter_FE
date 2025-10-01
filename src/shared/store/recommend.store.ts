import { create } from "zustand";
import { RecommendStore, start } from "./type";

export const useStartStore = create<start>((set) => ({
  lat: 0,
  lng: 0,
  setStart: (start: start) => set(start),
}));

export const useRecommendStore = create<RecommendStore>((set) => ({
  explain: "",
  data: [],
  setRecommend: (recommend: RecommendStore) => set(recommend),
}));