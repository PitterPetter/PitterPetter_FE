// option 데이터를 전송하는 API

import { api } from "../../shared/api/base";
import { Option } from "./types";

export const postOption = async (data: { user_choice: Option }) => {
  try {
    const response = await api.post('/api/recommends', data);
    return response.data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

