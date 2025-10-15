// option 데이터를 전송하는 API

import { api } from "../../shared/api/base";
import { Option } from "./types";
import { saveOptionToSession } from "./utils/sessionStorage";

export const postOption = async (data: { user_choice: Option }) => {
  try {
    console.log('body data: ', data);
    // 세션에 옵션 데이터 저장
    saveOptionToSession(data.user_choice);
    
    const response = await api.post('/api/recommends', data);
    return response.data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

