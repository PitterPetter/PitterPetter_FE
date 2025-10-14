import { create } from "zustand";
import { DistrictInfo } from "../../features/mypage/types";

export interface DistrictStore {
  selectedDistricts: DistrictInfo[];
  setSelectedDistricts: (districts: DistrictInfo[]) => void;
  clearSelectedDistricts: () => void;
}

export const useDistrictStore = create<DistrictStore>((set) => ({
  selectedDistricts: [],
  setSelectedDistricts: (districts: DistrictInfo[]) => set({ selectedDistricts: districts }),
  clearSelectedDistricts: () => set({ selectedDistricts: [] }),
}));
