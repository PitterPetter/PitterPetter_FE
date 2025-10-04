import { create } from "zustand";
import { HeaderStore } from "./type";

export const useHeaderStore = create<HeaderStore>((set) => ({
  isOpen: true,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));