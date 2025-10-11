import { api } from "../../shared/api/base";

export const mypageApi = {
  getMypage: () => api.get('/api/auth/mypage'),
  patchMypage: (data: any) => api.patch('/api/auth/mypage', data),
};

