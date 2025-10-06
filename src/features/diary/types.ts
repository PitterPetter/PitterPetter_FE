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
