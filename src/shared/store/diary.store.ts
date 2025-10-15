import { create } from "zustand";
import { DiaryStore } from "./type";

export const useDiaryStore = create<DiaryStore>((set) => ({
  courseId: '',
  setCourseId: (courseId: string) => set({ courseId }),
  rating: 0,
  setRating: (rating: number) => set({ rating }),

  // 다이어리 작성
  diaryTitle: '',
  setDiaryTitle: (diaryTitle: string) => set({ diaryTitle }),
  diaryContent: '',
  setDiaryContent: (diaryContent: string) => set({ diaryContent }),
  diaryImage: null as File | null,
  setDiaryImage: (diaryImage: File | null) => set({ diaryImage }),
}));