import { api } from "../../shared/api/base";

export const mypageApi = {
  getMypage: () => api.get('/api/auth/mypage'),
  putMypage: (data: any) => api.put('/api/auth/profile', data),
  deleteCouple: () => api.delete("/api/couples/cancel"),
  putCoupleHome: (data: any) => api.put('/api/couples', data),
  getDistrictLock: () => api.get('/api/districts/lock-status'),
  unlockDistrict: (districtId: string) => api.post(`/api/districts/${districtId}/unlock`),
  confirmDistrictSelection: (districtIds: string[]) => api.post('/api/auth/confirm-districts', { districtIds }),
};

