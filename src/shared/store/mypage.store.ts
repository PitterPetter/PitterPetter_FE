import { create } from "zustand";
import { MypageStore } from "./type";

export const useMypageStore = create<MypageStore>((set) => ({
  isProfileLoading: false,
  setIsProfileLoading: (isProfileLoading: boolean) => set({ isProfileLoading }),
  isProfileError: false,
  setIsProfileError: (isProfileError: boolean) => set({ isProfileError }),
}));