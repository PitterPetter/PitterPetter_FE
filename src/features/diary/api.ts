import { api } from "../../shared/api/base";

export const diaryApi = {
  getDiaryList: () => api.get('/api/diaries'),
  createDiary: (data: any) => api.post('/api/diaries', data),
};

export const courseApi = {
  getCourseList: () => api.get('/api/courses'),
};