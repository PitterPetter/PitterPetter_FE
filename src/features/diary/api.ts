import { api } from "../../shared/api/base";

// 다이어리 목록 조회 API
export const diaryApi = {
  getDiaryList: (page: number = 0, size: number = 6) => 
    api.get(`/api/diaries?page=${page}&size=${size}`),
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

// 다이어리 생성 API
export const diaryCreateApi = {
  createDiary: (data: any) => api.post('/api/diaries', data),
};

// 다이어리 수정 API
export const diaryUpdateApi = {
  updateDiary: (id: string, data: any) => api.put(`/api/diaries/${id}`, data),
};

// 다이어리 삭제 API
export const diaryDeleteApi = {
  deleteDiary: (id: string) => api.delete(`/api/diaries/${id}`),
};

// 댓글 API
export const commentApi = {
  // 댓글 작성
  createComment: (diaryId: string, data: { content: string }) => 
    api.post(`/api/diaries/${diaryId}/comments`, data),
  
  // 댓글 수정
  updateComment: (diaryId: string, commentId: string, data: { content: string }) => 
    api.put(`/api/diaries/${diaryId}/comments/${commentId}`, data),
  
  // 댓글 삭제
  deleteComment: (diaryId: string, commentId: string) => 
    api.delete(`/api/diaries/${diaryId}/comments/${commentId}`),
};