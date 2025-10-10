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

export const getRedirectPath = async (): Promise<string> => {
  try {
    const response = await api.get('/api/auth/redirect');
    if (response.data && response.data.success) {
      console.log('[authApi] redirect url fetched:', response.data.redirectUrl);
      return response.data.redirectUrl;
    }

    return '/home';
  } catch (error) {
     console.error("[authApi] Failed to fetch redirect path, falling back to /home:", error);
     return '/home';
  }
};