import { api } from "../../shared/api/base";
import { CoupleRoom } from "./types";

export const postCoupleRoom = async (coupleRoom: CoupleRoom) => {
  try {
    const response = await api.post('/api/couple/room', coupleRoom);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};