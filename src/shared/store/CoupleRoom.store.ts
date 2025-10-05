import { create } from "zustand";
import { CoupleRoomStore } from "./type";

export const useCoupleRoomStore = create<CoupleRoomStore>((set) => ({
  coupleId: '',
  coupleName: '',
  coupleDate: '',
  setCoupleRoom: (coupleRoom: CoupleRoomStore) => set(coupleRoom),
}));