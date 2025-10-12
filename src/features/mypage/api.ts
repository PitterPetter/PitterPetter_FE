import { api } from "../../shared/api/base";

export const mypageApi = {
  getMypage: () => api.get('/api/auth/mypage'),
  putMypage: (data: any) => api.put('/api/auth/profile', data),
  deleteCouple: (coupleCode: string) => api.delete(`/api/couples/room/${coupleCode}`),
  putCoupleHome: (data: any) => api.put('/api/couples', data),
};

