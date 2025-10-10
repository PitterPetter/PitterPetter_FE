// token storage

let ACCESS = "";

export const tokenStore = {
  getAccessToken() {
    console.log("[tokenStore] getAccessToken:", ACCESS ? "exists" : "empty");
    return ACCESS;
  },
  setAccessToken(token: string) {
    ACCESS = token;
    console.log("[tokenStore] setAccessToken: updated");
  },
  clear() {
    ACCESS = "";
    console.log("[tokenStore] clear: done");
  },
};