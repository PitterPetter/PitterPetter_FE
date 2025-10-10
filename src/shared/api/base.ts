// axios 인스턴스 + access 헤더 주입 + 401시 refresh(Authorization: Bearer <refresh>) 처리

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ENV } from "../config/env";
import { tokenStore } from "../lib/tokenStore";
import { raw } from "./raw";

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let pendingQueue: { resolve: (token: string) => void; reject: (error: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null) => {
  if (pendingQueue.length === 0) return;
  
  console.log("[auth] Processing", pendingQueue.length, "queued requests");
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) {
      console.log("[auth] Resolving queued request with new token");
      resolve(token);
    } else {
      console.log("[auth] Rejecting queued request");
      reject(error);
    }
  });
  pendingQueue = [];
  console.log("[auth] Queue cleared");
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

  if (!isPublic && access) {
    config.headers = { ...(config.headers as any), Authorization: `Bearer ${access}` };
    console.log("[req]", config.method?.toUpperCase(), path, "| with auth");
  } else if (isPublic) {
    console.log("[req]", config.method?.toUpperCase(), path, "| public endpoint");
  } else {
    console.log("[req]", config.method?.toUpperCase(), path, "| no token available");
  }
  return config;
});

// Response: 401/419/440 → refresh 진행
api.interceptors.response.use(
  (res) => {
    console.log("[res]", res.config?.method?.toUpperCase(), getPathname(res.config?.url), "| status:", res.status);
    return res;
  },
  async (error: AxiosError) => {
    const original = (error.config || {}) as RetriableConfig;
    const status = error.response?.status;
    const path = getPathname(original.url);
    const errorData = error.response?.data as any;

    console.warn("[res]", original.method?.toUpperCase(), path, "| status:", status);
    if (errorData?.message) {
      console.warn("[res] Server message:", errorData.message);
    }

    const isAuthExpired = status === 401 || status === 419 || status === 440;
    const isRefreshCall = path === REFRESH_PATH;

    if (!isAuthExpired || original._retry || isRefreshCall) {
      if (isRefreshCall) {
        console.error("[auth] Refresh endpoint failed - cannot retry");
      } else if (original._retry) {
        console.error("[auth] Already retried - giving up");
      } else {
        console.log("[auth] Not an auth error - passing through");
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      console.log("[auth] Refresh in progress, queueing request:", path);
      try {
        const newToken = await new Promise<string>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        });
        console.log("[auth] Got new token from queue, retrying:", path);
        original.headers = { ...(original.headers as any), Authorization: `Bearer ${newToken}` };
        original._retry = true;
        return api(original);
      } catch (e) {
        console.error("[auth] Queue failed - session ended");
        tokenStore.clear();
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    console.log("[auth] Starting refresh flow from:", path);
    isRefreshing = true;
    original._retry = true;

    try {
      // refresh 토큰은 httpOnly 쿠키로 자동 전송됨
      console.log("[auth] Requesting token refresh with httpOnly cookie");

      const { data } = await raw.post(
        REFRESH_PATH,
        undefined,
        {
          withCredentials: true, // httpOnly 쿠키의 refresh 토큰 자동 전송
        }
      );

      const newAccess = (data as any)?.accessToken as string | undefined;

      if (!newAccess) {
        console.error("[auth] Refresh response missing accessToken");
        throw new Error("No accessToken in refresh response");
      }

      tokenStore.setAccessToken(newAccess);
      console.log("[auth] Token refresh successful");
      console.log("[auth] Broadcasting new token to", pendingQueue.length, "pending requests");
      processQueue(null, newAccess);

      original.headers = { ...(original.headers as any), Authorization: `Bearer ${newAccess}` };
      console.log("[auth] Retrying original request:", path);
      return api(original);
    } catch (e) {
      const axiosError = e as AxiosError;
      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data as any;
      
      console.error("[auth] Token refresh failed");
      console.error("[auth] Error details:", {
        status,
        code: errorData?.code,
        message: errorData?.message || axiosError.message,
        detail: errorData?.error?.detail,
      });

      processQueue(e, null);

      // 인증 에러(401, 403)만 로그인으로 리다이렉트
      if (status === 401 || status === 403) {
        console.warn("[auth] Authentication failed - redirect to login");
        console.warn("[auth] Reason:", errorData?.message || "Token expired or invalid");
        tokenStore.clear();
        window.location.href = "/login";
      } else {
        // 네트워크 오류, 서버 오류 등은 그냥 에러 전달
        console.error("[auth] Network or server error - not redirecting");
        console.error("[auth] Status:", status || "No response");
        console.error("[auth] This might be temporary. User can retry.");
      }
      
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
      console.log("[auth] Refresh process finished");
    }
  }
);
