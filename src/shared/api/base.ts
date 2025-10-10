// axios 인스턴스 + access 헤더 주입 + 401시 refresh(Authorization: Bearer <refresh>) 처리

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ENV } from "../config/env";
import { tokenStore } from "../lib/tokenStore";
import { refreshStore } from "../lib/refreshStore";
import { raw } from "./raw";

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let pendingQueue: { resolve: (token: string) => void; reject: (error: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null) => {
  console.log("[auth] processQueue: start, length =", pendingQueue.length, "token =", !!token);
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
  console.log("[auth] processQueue: done");
};

const getPathname = (url?: string) => {
  if (!url) return "";
  try {
    return new URL(url, ENV.API_BASE_URL).pathname;
  } catch {
    return url;
  }
};

const LOGIN_PATH = "/api/auth/login";
const REFRESH_PATH = "/api/auth/refresh";
const PUBLIC_PATHS = [LOGIN_PATH, REFRESH_PATH];

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request: access 있으면 Authorization 헤더 주입
api.interceptors.request.use((config) => {
  const path = getPathname(config.url);
  const isPublic = PUBLIC_PATHS.includes(path);
  const access = tokenStore.getAccessToken();

  console.log("[req] url:", config.url, "| path:", path, "| public:", isPublic, "| access:", access ? "exists" : "none");

  if (!isPublic && access) {
    config.headers = { ...(config.headers as any), Authorization: `Bearer ${access}` };
    console.log("[req] Authorization header attached");
  } else {
    console.log("[req] Authorization header skipped");
  }
  return config;
});

// Response: 401/419/440 → refresh 진행
api.interceptors.response.use(
  (res) => {
    console.log("[res] ok:", getPathname(res.config?.url), "| status:", res.status);
    return res;
  },
  async (error: AxiosError) => {
    const original = (error.config || {}) as RetriableConfig;
    const status = error.response?.status;
    const path = getPathname(original.url);

    console.warn("[res] error:", path, "| status:", status, "| _retry:", original._retry);

    const isAuthExpired = status === 401 || status === 419 || status === 440;
    const isRefreshCall = path === REFRESH_PATH;

    if (!isAuthExpired || original._retry || isRefreshCall) {
      console.warn("[auth] bypass refresh. isAuthExpired:", isAuthExpired, "isRefreshCall:", isRefreshCall, "alreadyRetried:", !!original._retry);
      return Promise.reject(error);
    }

    if (isRefreshing) {
      console.log("[auth] already refreshing. enqueue request:", path);
      try {
        const newToken = await new Promise<string>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        });
        console.log("[auth] dequeued with new token. retry:", path);
        original.headers = { ...(original.headers as any), Authorization: `Bearer ${newToken}` };
        original._retry = true;
        return api(original);
      } catch (e) {
        console.error("[auth] dequeue failed. redirect to /login");
        tokenStore.clear();
        refreshStore.clear();
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    console.log("[auth] start refresh. from:", path);
    isRefreshing = true;
    original._retry = true;

    try {
      // 서버가 Authorization 헤더에 refresh를 요구
      const refresh = refreshStore.get();
      if (!refresh) {
        console.warn("[auth] no refresh token. redirect to /login");
        tokenStore.clear();
        refreshStore.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      console.log("[auth] POST", REFRESH_PATH, "with Authorization: Bearer <refresh>");
      const { data } = await raw.post(
        REFRESH_PATH,
        undefined,
        {
          withCredentials: true, // 백엔드가 쿠키도 병행 확인한다면 유지
          headers: { Authorization: `Bearer ${refresh}` },
        }
      );

      const newAccess = (data as any)?.accessToken as string | undefined;
      const newRefresh = (data as any)?.refreshToken as string | undefined; // 토큰 회전 시 수신

      if (!newAccess) {
        console.error("[auth] refresh response missing accessToken");
        throw new Error("No accessToken in refresh response");
      }

      tokenStore.setAccessToken(newAccess);
      if (newRefresh) {
        refreshStore.set(newRefresh);
      }

      console.log("[auth] refresh success. broadcasting to queue");
      processQueue(null, newAccess);

      original.headers = { ...(original.headers as any), Authorization: `Bearer ${newAccess}` };
      console.log("[auth] retry original:", path);
      return api(original);
    } catch (e) {
      console.error("[auth] refresh failed:", e);
      processQueue(e, null);
      tokenStore.clear();
      refreshStore.clear();
      console.log("[auth] redirect -> /login");
      window.location.href = "/login";
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
      console.log("[auth] refresh finished");
    }
  }
);