// no interceptor axios instance (refresh calls)

import axios from "axios";
import { ENV } from "../config/env";

export const raw = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true, // 쿠키를 병행한다면 유지
  headers: { "Content-Type": "application/json" },
});