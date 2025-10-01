// base axios instance

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';
import { tokenStore } from '../lib/tokenStore';
import { raw } from './raw';

let isRefreshing = false;
let pendingQueue: {resolve: (token: string) => void; reject: (error: unknown) => void}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
}

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// request: 토큰 자동 주입
api.interceptors.request.use((config) => {
  const access = tokenStore.getAccessToken();
  if (access) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).authorization = `Bearer ${access}`;
  }
  return config;
});

// response: 401 에러 처리 + token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original?._retry) {
      // 이미 리프레시 중이면 큐에 대기
      if (isRefreshing) {
        const newToken = await new Promise<string>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        });
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
        original._retry = true;
        return api(original);
      }

      // refresh 진행
      original._retry = true;
      isRefreshing = true;
      try {
        const refresh = tokenStore.getRefresh();
        if (!refresh) {
          tokenStore.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const {data} = await raw.post('/auth/refresh', { refreshToken: refresh });
        const newAccess = data?.accessToken as string;
        const newRefresh = data?.refreshToken as string | undefined;

        if (!newAccess) throw new Error('No access token in refresh response');

        tokenStore.setTokens(newAccess, newRefresh);

        processQueue(null, newAccess);

        // retry
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStore.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
)