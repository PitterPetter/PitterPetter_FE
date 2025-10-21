// token storage

const ACCESS_KEY = "accessToken";

export const tokenStore = {
  getAccessToken() {
    const token = sessionStorage.getItem(ACCESS_KEY) ?? "";
    return token;
  },
  setAccessToken(token: string) {
    sessionStorage.setItem(ACCESS_KEY, token);
  },
  clear() {
    sessionStorage.removeItem(ACCESS_KEY);
  },
};