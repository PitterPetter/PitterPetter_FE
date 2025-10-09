import { api } from "../../shared/api/base";
import { PostCoupleRoom } from "./types";

export const coupleRoomApi = {
  createCoupleRoom: (coupleRoom: PostCoupleRoom) => api.post('/api/coupleroom', coupleRoom),
};