export interface DistrictInfo {
  id: string;
  name: string;
  isLocked: boolean;
  description?: string;
}

export interface CityData {
  cityName: string;
  totalDistricts: number;
  lockedDistricts: number;
  unlockedDistricts: number;
  districts: DistrictInfo[];
}

export interface DistrictLockData {
  totalKeys: number;
  cities: CityData[];
}
