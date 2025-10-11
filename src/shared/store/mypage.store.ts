import { create } from "zustand";
import { MypageStore } from "./type";

export const useMypageStore = create<MypageStore>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  isError: false,
  setIsError: (isError: boolean) => set({ isError }),
}));