import { api } from "../../shared/api/base";
import { PostCoupleRoom, GetId } from "./types";

export const postCoupleRoom = async (coupleRoom: PostCoupleRoom) => {
  try {
    const response = await api.post('/api/couple/room', coupleRoom);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};