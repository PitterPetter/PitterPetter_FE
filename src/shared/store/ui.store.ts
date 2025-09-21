import { create } from "zustand";
import { UIState } from "./type";

export const useUIStore = create<UIState>()((set) => ({
      isMapReady: false,
      setMapReady: (v) => set({ isMapReady: v })
    }));