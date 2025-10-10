// token storage

const ACCESS_KEY = "accessToken";

export const tokenStore = {
  getAccessToken() {
    const token = sessionStorage.getItem(ACCESS_KEY) ?? "";
    console.log("[tokenStore] getAccessToken:", token ? "exists" : "empty");
    return token;
  },
  setAccessToken(token: string) {
    sessionStorage.setItem(ACCESS_KEY, token);
    console.log("[tokenStore] setAccessToken: updated");
  },
  clear() {
    sessionStorage.removeItem(ACCESS_KEY);
    console.log("[tokenStore] clear: done");
  },
};