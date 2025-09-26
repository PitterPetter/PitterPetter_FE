export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  MAPBOX_ACCESS_TOKEN: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string,
  TIMEOUT_MS: Number(import.meta.env.VITE_API_TIMEOUT ?? 8000),
}