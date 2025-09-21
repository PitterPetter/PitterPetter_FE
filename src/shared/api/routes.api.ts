import { RouteResult, SegmentKey } from "./type";

export const routeQueryKey = (k: SegmentKey) => [
  'route', k.start[0], k.start[1], k.end[0], k.end[1]
] as const;

export async function fetchRoute(
  k: SegmentKey,
  signal?: AbortSignal,
): Promise<RouteResult> {
  const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${k.start[0]},${k.start[1]};${k.end[0]},${k.end[1]}?geometries=geojson&access_token=${(window as any).mapboxgl?.accessToken ?? import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error('directions failed');
  const data = await response.json();
  const r = data?.routes?.[0];
  if (!r) throw new Error('no route');
  return { geometry: r.geometry, distance: r.distance, duration: r.duration };
}