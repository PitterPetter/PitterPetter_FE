// token storage

const ACCESS = 'accessToken';
const REFRESH = 'refreshToken';

export const tokenStore = {
  getAccessToken() {console.log("HIHI"); return sessionStorage.getItem(ACCESS) ?? ''; },
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