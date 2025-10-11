import { create } from "zustand";
import { MypageStore } from "./type";

export const useMypageStore = create<MypageStore>((set) => ({
  isProfileLoading: false,
  setIsProfileLoading: (isProfileLoading: boolean) => set({ isProfileLoading }),
  isProfileError: false,
  setIsProfileError: (isProfileError: boolean) => set({ isProfileError }),
  name: '',
  setName: (name: string) => set({ name }),
  nickname: '',
  setNickname: (nickname: string) => set({ nickname }),
  email: '',
  setEmail: (email: string) => set({ email }),
  birthdate: '',
  setBirthdate: (birthdate: string) => set({ birthdate }),
}));