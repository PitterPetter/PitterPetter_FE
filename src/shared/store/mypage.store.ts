import { create } from "zustand";
import { MypageStore, CoupleInfoStore } from "./type";

export const useMypageStore = create<MypageStore & CoupleInfoStore>((set) => ({
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
  ticket: 0,
  setTicket: (ticket: number) => set({ ticket }),
  // 커플 정보
  coupleHomeName: '',
  setCoupleHomeName: (coupleHomeName: string) => set({ coupleHomeName }),
  datingStartDate: '',
  setDatingStartDate: (datingStartDate: string) => set({ datingStartDate }),
  partnerName: '',
  setPartnerName: (partnerName: string) => set({ partnerName }),
  partnerEmail: '',
  setPartnerEmail: (partnerEmail: string) => set({ partnerEmail })
}));