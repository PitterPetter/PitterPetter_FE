export interface Course {
  id: string;
  title: string;
  content: string;
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
