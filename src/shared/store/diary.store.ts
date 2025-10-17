import { create } from "zustand";
import { DiaryStore } from "./type";

export const useDiaryStore = create<DiaryStore>((set) => ({
  courseId: '',
  setCourseId: (courseId: string) => set({ courseId }),
  courseName: '',
  setCourseName: (courseName: string) => set({ courseName }),
  rating: 0,
  setRating: (rating: number) => set({ rating }),

  // 다이어리 작성
  diaryTitle: '',
  setDiaryTitle: (diaryTitle: string) => set({ diaryTitle }),
  diaryContent: '',
  setDiaryContent: (diaryContent: string) => set({ diaryContent }),
  diaryImage: null as File | null,
  setDiaryImage: (diaryImage: File | null) => set({ diaryImage }),
  existingImageUrl: null as string | null,
  setExistingImageUrl: (existingImageUrl: string | null) => set({ existingImageUrl }),
  isImageRemoved: false,
  setIsImageRemoved: (isImageRemoved: boolean) => set({ isImageRemoved }),
  isImageChanged: false,
  setIsImageChanged: (isImageChanged: boolean) => set({ isImageChanged }),
  
  // store 초기화
  resetDiaryForm: () => set({ 
    diaryTitle: '', 
    diaryContent: '', 
    diaryImage: null,
    existingImageUrl: null,
    isImageRemoved: false,
    isImageChanged: false,
    courseId: '',
    courseName: '',
    rating: 0
  }),
}));