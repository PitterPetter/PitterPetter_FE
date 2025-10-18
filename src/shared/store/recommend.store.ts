import { create } from "zustand";
import { RecommendStore, start, Place } from "./type";
import { saveRecommendToSession, loadRecommendFromSession, clearRecommendFromSession } from "../../features/recommend/utils/sessionStorage";

export const useStartStore = create<start>((set) => ({
  lat: 0,
  lng: 0,
  setStart: (start: start) => set(start),
}));

export const useRecommendStore = create<RecommendStore>((set, get) => ({
  explain: "",
  data: [],
  lawData: [],
  setLawData: (lawData: any[]) => set({ lawData }),
  selectedPlace: null,
  setRecommend: (recommend: { explain: string; data: Place[] }) => {
    set(recommend);
    // session storage에 저장
    saveRecommendToSession(recommend.explain, recommend.data);
  },
  setSelectedPlace: (place: Place | null) => set({ selectedPlace: place }),
  // session storage에서 데이터 복원
  restoreFromSession: () => {
    const sessionData = loadRecommendFromSession();
    if (sessionData) {
      set({
        explain: sessionData.explain,
        data: sessionData.data
      });
      return true;
    }
    return false;
  },
  // session storage 클리어
  clearSession: () => {
    clearRecommendFromSession();
    set({ explain: "", data: [], selectedPlace: null });
  }
}));