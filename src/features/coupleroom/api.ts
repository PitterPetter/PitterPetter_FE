import { api } from "../../shared/api/base";
import { PostCoupleRoom } from "./types";

export const coupleRoomApi = {
  createCoupleRoom: (coupleRoom: PostCoupleRoom) => api.post('/api/home/coupleroom', coupleRoom),
  validateCoupleCode: (coupleCode: string) => api.post('/api/couples/match', coupleCode),
};