export interface DistrictInfo {
  id: number | string;
  name: string;
  isLocked: boolean;
  description?: string;
  lat?: number;
  lng?: number;
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
