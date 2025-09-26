// token storage

const ACCESS = 'access_token';
const REFRESH = 'refresh_token';

export const tokenStore = {
  getAccessToken() {return sessionStorage.getItem(ACCESS) ?? ''; },
  getRefresh() { return sessionStorage.getItem(REFRESH) ?? ''; },
  setTokens(access: string, refresh?: string) {
    sessionStorage.setItem(ACCESS, access);
    if (refresh) sessionStorage.setItem(REFRESH, refresh);
  },
  clear() {
    sessionStorage.removeItem(ACCESS);
    sessionStorage.removeItem(REFRESH);
  },
};