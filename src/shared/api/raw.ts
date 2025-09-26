// no interceptor axios instance (refresh calls)

import axios from 'axios';
import { ENV } from '../config/env';

export const raw = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  }
});