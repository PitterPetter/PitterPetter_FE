export interface Course {
  courseId: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  likeCount: number;
  lat: number;
  lng: number;
  isLiked: boolean;
}

// 백엔드 DiarySummary와 일치하는 타입
export interface Diary {
  diaryId: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  commentCount: number;
  imageId: string | null;
  imageUrl: string | null;
  imageStatus: string | null;
  imageExpiresIn: number | null;
}

export type DiaryCreatePayload = {
  title: string;
  content: string;
  courseId: string | null;
  courseName: string | null;
  rating: string;
  image: null | {
    originalFileName: string;
    contentType: string;
    sizeBytes: number;
  };
  removeImage: boolean;
};

// 백엔드 PageInfo와 일치하는 타입
export interface PageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 백엔드 DiaryListResponse와 일치하는 타입
export interface DiaryListResponse {
  content: Diary[];
  page: PageInfo;
}