import { api } from "../../shared/api/base";

export const districtApi = {
  // 초기 지역락 해제 (처음 2개 지역 선택)
  initUnlockDistrict: (regions: string[]) => api.post(`/api/regions/unlock/init`, { regions }),
  // 티켓으로 지역락 해제 (추가 지역 해제)
  rewardUnlockDistrict: (regions: string[]) => api.post(`/api/regions/unlock/reward`, { regions }),
  getDistrictLock: () => api.get('/api/regions/search'),
};