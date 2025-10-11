import { api } from "../../shared/api/base";

export const mypageApi = {
  getMypage: () => api.get('/api/auth/mypage'),
  putMypage: (data: any) => api.put('/api/auth/mypage', data),
};

