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
  setRecommend: (recommend: { explain: string; data: Place[] }) => void;
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
  rating: number;
  setRating: (rating: number) => void;

  // 다이어리 작성
  diaryTitle: string;
  setDiaryTitle: (diaryTitle: string) => void;
  diaryContent: string;
  setDiaryContent: (diaryContent: string) => void;
  diaryImage: string;
  setDiaryImage: (diaryImage: string) => void;
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