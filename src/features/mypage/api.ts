import { api } from "../../shared/api/base";

export const mypageApi = {
  getMypage: () => api.get('/api/auth/mypage'),
  putMypage: (data: any) => api.put('/api/auth/profile', data),
  deleteCouple: () => api.delete("/api/couples/cancel"),
  putCoupleHome: (data: any) => api.put('/api/couples', data)
};

