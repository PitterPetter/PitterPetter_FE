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

export interface Diary {
  diaryId: string;
  title: string;
  excerpt: string;
  content?: string;
  updatedAt: string;
  createdAt?: string;
  likeCount: number;
  lat: number;
  lng: number;
  isLiked: boolean;
  commentCount: number;
  imageUrl?: string;
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

// API 응답 타입
export interface DiaryListResponse {
  result: {
    content: Diary[];
    page: {
      totalPages: number;
      totalElements: number;
    };
  };
}