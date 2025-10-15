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
  updatedAt: string;
  likeCount: number;
  lat: number;
  lng: number;
  isLiked: boolean;
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