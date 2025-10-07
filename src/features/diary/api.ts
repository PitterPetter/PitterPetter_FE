import { api } from "../../shared/api/base";

export const diaryApi = {
  getDiaryList: () => api.get('/api/diaries'),
};