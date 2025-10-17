import { api } from "../../shared/api/base";

export const districtApi = {
  unlockDistrict: (regions: string[]) => api.post(`/api/regions/unlock`, { regions }),
  getDistrictLock: () => api.get('/api/regions/search'),
};