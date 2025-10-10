// base axios instance with robust refresh handling and detailed logging

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ENV } from "../config/env";
import { tokenStore } from "../lib/tokenStore";
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
    return url; // fallback
  }
};

const PUBLIC_PATHS = ["/auth/login", "/auth/refresh"]; // 필요 시 추가

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // 쿠키 전송
});

//  Request Interceptor - access 토큰이 있으면 Authorization 헤더 주입
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

// Response Interceptor
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

    // 인증 만료로 간주할 코드 모음 (백엔드 정책에 맞춰 확장 가능)
    const isAuthExpired = status === 401 || status === 419 || status === 440;

    // refresh 요청 자체이거나, 재시도 이미 했거나, 인증 만료가 아니면 패스
    const isRefreshCall = path === "/api/auth/refresh";
    if (!isAuthExpired || original._retry || isRefreshCall) {
      console.warn("[auth] bypass refresh. isAuthExpired:", isAuthExpired, "isRefreshCall:", isRefreshCall, "alreadyRetried:", !!original._retry);
      return Promise.reject(error);
    }

    // 이미 refresh 중이면 큐에 대기
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
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    // refresh 시도
    console.log("[auth] start refresh. from:", path);
    isRefreshing = true;
    original._retry = true;

    try {
      // 쿠키로 인증 → 본문 없이 호출
      console.log("[auth] POST /api/auth/refresh");
      const { data } = await raw.post("/api/auth/refresh", undefined, { withCredentials: true });

      const newAccess = (data as any)?.accessToken as string | undefined;
      if (!newAccess) {
        console.error("[auth] refresh response missing accessToken");
        throw new Error("No accessToken in refresh response");
      }

      tokenStore.setAccessToken(newAccess);
      console.log("[auth] refresh success. broadcasting to queue");
      processQueue(null, newAccess);

      // 원 요청 재시도
      original.headers = { ...(original.headers as any), Authorization: `Bearer ${newAccess}` };
      console.log("[auth] retry original:", path);
      return api(original);
    } catch (e) {
      console.error("[auth] refresh failed:", e);
      processQueue(e, null);
      tokenStore.clear();
      console.log("[auth] redirect -> /login");
      window.location.href = "/login";
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
      console.log("[auth] refresh finished");
    }
  }
);
