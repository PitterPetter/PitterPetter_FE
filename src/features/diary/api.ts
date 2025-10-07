import { api } from "../../shared/api/base";

// 다이어리 목록 조회 API
export const diaryApi = {
  getDiaryList: () => api.get('/api/diaries'),
  createDiary: (data: any) => api.post('/api/diaries', data),
};

// 코스 조회 API
export const courseApi = {
  getCourseList: () => api.get('/api/courses'),
};

// 다이어리 상세 조회 API
export const diaryDetailApi = {
  getDiaryDetail: (id: string) => api.get(`/api/diaries/${id}`),
};