import { tokenStore } from "../../../shared/lib/tokenStore";

const TEMP_ENV_KEYS = [
  "VITE_TEMPORY_KEY",
  "VITE_TEMPORARY_KEY",
  "VITE_TEMP_TOKEN",
];

const pickTempToken = (): string | undefined => {
  const env = import.meta.env as Record<string, unknown>;
  for (const key of TEMP_ENV_KEYS) {
    const value = env[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return undefined;
};

export const injectTempToken = () => {
  if (typeof window === "undefined") {
    return;
  }

  const envToken = pickTempToken();
  if (!envToken) {
    return;
  }

  const current = tokenStore.getAccessToken();
  if (current === envToken) {
    return;
  }

  tokenStore.setAccessToken(envToken);
};
