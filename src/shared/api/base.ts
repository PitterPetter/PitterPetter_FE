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
  console.log('API 요청 인터셉터 실행:', config.url);
  const access = tokenStore.getAccessToken();
  if (access) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).authorization = `Bearer ${access}`;
  }
  console.log('요청 헤더:', config.headers);
  console.log('Authorization 헤더:', (config.headers as any)?.authorization || '없음');
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
      console.log('refresh 시도');
      original._retry = true;
      isRefreshing = true;
      try {
        const refresh = tokenStore.getRefresh();
        console.log('Refresh 토큰:', refresh ? '있음' : '없음');
        if (!refresh) {
          console.log('Refresh 토큰 없음 → 로그인 페이지로 이동');
          tokenStore.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        console.log('Refresh API 호출 중');
        const {data} = await raw.post('/auth/refresh', { refreshToken: refresh });
        const newAccess = data?.accessToken as string;
        const newRefresh = data?.refreshToken as string | undefined;

        if (!newAccess) throw new Error('No access token in refresh response');

        console.log('새 토큰 발급 완료');
        tokenStore.setTokens(newAccess, newRefresh);

        processQueue(null, newAccess);

        // retry
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (refreshError) {
        console.log('Refresh 실패:', refreshError);
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