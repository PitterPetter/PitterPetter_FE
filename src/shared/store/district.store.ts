import { create } from 'zustand';
import { DistrictInfo } from '../../features/mypage/types';

interface DistrictStore {
  selectedDistrict: DistrictInfo | null;
  selectedDistricts: DistrictInfo[];
  setSelectedDistrict: (district: DistrictInfo | null) => void;
  setSelectedDistricts: (districts: DistrictInfo[]) => void;
  clearSelectedDistrict: () => void;
  clearSelectedDistricts: () => void;
}

export const useDistrictStore = create<DistrictStore>((set) => ({
  selectedDistrict: null,
  selectedDistricts: [],
  setSelectedDistrict: (district) => set({ selectedDistrict: district }),
  setSelectedDistricts: (districts) => set({ selectedDistricts: districts }),
  clearSelectedDistrict: () => set({ selectedDistrict: null }),
  clearSelectedDistricts: () => set({ selectedDistricts: [] }),
}));