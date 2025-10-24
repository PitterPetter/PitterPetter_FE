// MarkerStore
export interface MarkerStore {
  isMarkers: boolean;
  setIsMarkers: (value: boolean) => void;
}
export interface PlaceStore {
  isPlace: boolean;
  setIsPlace: (value: boolean) => void;
}

// UIStore
export type UIState = {
  isMapReady: boolean;
  setMapReady: (v: boolean) => void;
}

// RecommendStore
export type start = {
  lat: number;
  lng: number;
}

export type Place = {
  seq: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  indoor: boolean;
  price_level?: number;
  open_hours?: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
  alcohol?: number;
  mood_tag: number;
  food_tag?: string[];
  rating_avg?: number;
  link?: string;
};

export type RecommendStore = {
  explain: string;
  data: Place[];
  lawData: any[];
  selectedPlace: Place | null;
  setRecommend: (recommend: { explain: string; data: Place[] }) => void;
  setLawData: (lawData: any[]) => void;
  setSelectedPlace: (place: Place | null) => void;
  restoreFromSession: () => boolean;
  clearSession: () => void;
};

// HeaderStore
export type HeaderStore = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

// CoupleRoomStore
export type CoupleRoomStore = {
  coupleName: string;
  coupleDate: string;
  setCoupleRoom: (coupleRoom: CoupleRoomStore) => void;
  coupleCode: string;
  setCoupleCode: (coupleCode: string) => void;
};

// DiaryStore
export type DiaryStore = {
  courseId: string;
  setCourseId: (courseId: string) => void;
  courseName: string;
  setCourseName: (courseName: string) => void;
  rating: number;
  setRating: (rating: number) => void;

  // 다이어리 작성
  diaryTitle: string;
  setDiaryTitle: (diaryTitle: string) => void;
  diaryContent: string;
  setDiaryContent: (diaryContent: string) => void;
  diaryImage: File | null;
  setDiaryImage: (diaryImage: File | null) => void;
  existingImageUrl: string | null;
  setExistingImageUrl: (existingImageUrl: string | null) => void;
  isImageRemoved: boolean;
  setIsImageRemoved: (isImageRemoved: boolean) => void;
  isImageChanged: boolean;
  setIsImageChanged: (isImageChanged: boolean) => void;
  
  // store 초기화
  resetDiaryForm: () => void;
};

// MypageStore
export type MypageStore = {
  isProfileLoading: boolean;
  setIsProfileLoading: (isProfileLoading: boolean) => void;
  isProfileError: boolean;
  setIsProfileError: (isProfileError: boolean) => void;
  name: string;
  setName: (name: string) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
  email: string;
  setEmail: (email: string) => void;
  birthdate: string;
  setBirthdate: (birthdate: string) => void;
  ticket: number;
  setTicket: (ticket: number) => void;
};

// CoupleInfoStore
export type CoupleInfoStore = {
  coupleHomeName: string;
  setCoupleHomeName: (coupleHomeName: string) => void;
  datingStartDate: string;
  setDatingStartDate: (datingStartDate: string) => void;
  partnerName: string;
  setPartnerName: (partnerName: string) => void;
  partnerEmail: string;
  setPartnerEmail: (partnerEmail: string) => void;
};

// DistrictStore
export type DistrictStore = {
  district: DistrictInfo | null;
  setDistrict: (district: DistrictInfo | null) => void;
};

// AuthStore
export type AuthStore = {
  permissionLevel: "ONBOARDING_REQUIRED" | "COUPLE_MATCHING_REQUIRED" | "ROCK_REQUIRED" | "COMPLETED" | '' | null;
  setPermissionLevel: (permissionLevel: "ONBOARDING_REQUIRED" | "COUPLE_MATCHING_REQUIRED" | "ROCK_REQUIRED" | "COMPLETED" | '' | null) => void;
};

export interface DistrictInfo {
  id: number | string;
  name: string;
  locked: boolean;
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

// OnboardingStore
export type Onboarding = {
  alcoholPreference: DrinkingList;
  activeBound: ActiveList;
  dateCostPreference: CostList;
  favoriteFoodCategories: FoodList[];
  atmosphere: AtmosphereList;
  answeredCount: number;
  setAnsweredCount: (value: number) => void;
  setAlcoholPreference: (value: DrinkingList) => void;
  setActiveBound: (value: ActiveList) => void;
  setDateCostPreference: (value: CostList) => void;
  setFavoriteFoodCategories: (value: FoodList[] | ((prev: FoodList[]) => FoodList[])) => void;
  setAtmosphere: (value: AtmosphereList) => void;
};

export type DrinkingList = 0 | 1 | 2 | 3 | 4 | 5; // drinking category
export type ActiveList = 0 | 1 | 2 | 3 | 4 | 5; // active category
export type FoodList = '한식' | '중식' | '양식' | '일식' | '분식'; // food category
export type CostList = '' | '1만원 이하' | '1 ~ 3만원' | '3 ~ 5만원' | '5 ~ 8만원' | '8만원 이상'; // cost category
export type AtmosphereList = string; // atmosphere category
