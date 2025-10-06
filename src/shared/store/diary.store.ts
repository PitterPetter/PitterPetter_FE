import { create } from "zustand";
import { DiaryStore } from "./type";

export const useDiaryStore = create<DiaryStore>((set) => ({
  courseId: '',
  setCourseId: (courseId: string) => set({ courseId }),
}));