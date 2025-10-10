const REFRESH_KEY = "refreshToken";

export const refreshStore = {
  get() {
    const t = sessionStorage.getItem(REFRESH_KEY) ?? "";
    console.log("[refreshStore] get:", t ? "exists" : "empty");
    return t;
  },
  set(t: string) {
    sessionStorage.setItem(REFRESH_KEY, t);
    console.log("[refreshStore] set: updated");
  },
  clear() {
    sessionStorage.removeItem(REFRESH_KEY);
    console.log("[refreshStore] clear: done");
  },
};