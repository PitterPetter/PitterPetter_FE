import { create } from "zustand";
import { DiaryStore } from "./type";

export const useDiaryStore = create<DiaryStore>((set) => ({
  courseId: '',
  setCourseId: (courseId: string) => set({ courseId }),
  rating: 0,
  setRating: (rating: number) => set({ rating }),
}));