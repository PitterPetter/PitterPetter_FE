import React, { useEffect, useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useQueries } from '@tanstack/react-query';
import { useUIStore } from '../../shared/store/ui.store';
import { fetchRoute, routeQueryKey } from '../../shared/api/routes.api';
import { MapboxProps, MapRefs, Stop } from './type'; // RouteSegment 제거
import course from '../../features/Course/mocks/course.json';

const MapboxRecommendPage: React.FC<MapboxProps> = ({
  center = (() => {
    const allStops: Stop[] = course.items.flatMap(item => item.stops);
    const avgLng = allStops.reduce((s, v) => s + v.lng, 0) / allStops.length;
    const avgLat = allStops.reduce((s, v) => s + v.lat, 0) / allStops.length;
    return [avgLng, avgLat] as [number, number];
  })(),
  zoom = 15,
  pitch = 0
}) => {
  const mapContainerRef = useRef<MapRefs['container']>(null);
  const mapRef = useRef<MapRefs['map']>(null);

  const { isMapReady, setMapReady } = useUIStore();

  // 1) 맵 초기화 + 마커/임시 점선(직선)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center,
      zoom,
      pitch
    });
    mapRef.current = map;

    map.once('style.load', () => {
      map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
      map.setConfigProperty('basemap', 'showPlaceLabels', false);
      map.setConfigProperty('basemap', 'showRoadLabels', false);
      map.setConfigProperty('basemap', 'showTransitLabels', false);
    });

    // 3D 건물과 랜드마크 활성화 명시
    map.setConfigProperty('basemap', 'show3dObjects', true);
    map.setConfigProperty('basemap', 'showLandmarks', true);
    if (map.getLayer('building-3d')) {
      map.setLayoutProperty('building-3d', 'visibility', 'visible');
    }
    
    // 랜드마크 레이어 활성화
    const landmarkLayers = ['poi-scalerank1', 'poi-scalerank2', 'poi-scalerank3', 'poi-scalerank4-l1', 'poi-scalerank4-l15'];
    landmarkLayers.forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', 'none'); // POI 라벨은 숨기고 3D 건물만 표시
      }
    });

    map.on('load', () => {
      // 마커 + 임시 점선 먼저
      course.items.forEach(item => {
        const sorted: Stop[] = [...item.stops].sort((a, b) => a.seq - b.seq);

        sorted.forEach(stop => addSeqMarker(map, stop));

        for (let i = 0; i < sorted.length - 1; i++) {
          const s = sorted[i], e = sorted[i + 1];
          upsertLine(map, segId(s.id, e.id), lineString([s.lng, s.lat], [e.lng, e.lat]), false);
        }
      });

      setMapReady(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [center.toString(), zoom, pitch, setMapReady]);

  // 2) 세그먼트 목록
  const segments = useMemo(() => {
    const arr: {
      id: string;
      start: [number, number];
      end: [number, number];
      fromName: string;
      toName: string;
    }[] = [];

    course.items.forEach(item => {
      const stops: Stop[] = [...item.stops].sort((a, b) => a.seq - b.seq);
      for (let i = 0; i < stops.length - 1; i++) {
        const s = stops[i], e = stops[i + 1];
        arr.push({
          id: segId(s.id, e.id),
          start: [s.lng, s.lat],
          end: [e.lng, e.lat],
          fromName: s.name,
          toName: e.name
        });
      }
    });
    return arr;
  }, []);

  // 3) TanStack Query – 경로 호출/캐싱/상태
  const results = useQueries({
    queries: segments.map(seg => ({
      queryKey: routeQueryKey({ start: seg.start, end: seg.end }),
      queryFn: ({ signal }: { signal?: AbortSignal }) => fetchRoute({ start: seg.start, end: seg.end }, signal),
      enabled: isMapReady,
      staleTime: 10 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      retry: 1
    }))
  });

  // 4) 성공 시 실선으로 교체
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    results.forEach((r, i) => {
      if (!r.isSuccess) return;
      const seg = segments[i];
      upsertLine(map, seg.id, r.data.geometry as GeoJSON.LineString, true);
    });
  }, [results, segments, isMapReady]);

  // 5) 패널 데이터: 성공한 것만 집계
  const ok = results
    .map((r, i) => (r.isSuccess ? { seg: segments[i], ...r.data } : null))
    .filter(Boolean) as Array<{ seg: (typeof segments)[number]; distance: number; duration: number }>;

  const totalDistance = ok.reduce((s, x) => s + x.distance, 0);
  const totalDuration = ok.reduce((s, x) => s + x.duration, 0);

  const isAnyPending = results.some(r => r.isPending);
  const isAnyFetching = results.some(r => r.isFetching);

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 64px)', width: '100%' }}>
      <div ref={mapContainerRef} id="map" style={{ height: '100%', width: '100%' }} />

      {/* 전역 오버레이 */}
      {(!isMapReady || isAnyPending) && (
        <div className="pointer-events-none absolute inset-0 bg-white/40 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-transparent" />
          <span className="ml-3 text-gray-700 font-medium">경로 계산 중…</span>
        </div>
      )}

      {/* 루트 정보 패널 */}
      {(ok.length > 0 || isAnyPending || isAnyFetching) && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-30 min-w-[280px]">
          <h3 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
            코스 정보
            {isAnyFetching && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-600">갱신 중</span>
            )}
          </h3>

          {/* 스켈레톤 */}
          {ok.length === 0 && (isAnyPending || isAnyFetching) && (
            <div className="space-y-2 mb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="text-right ml-2">
                    <div className="h-4 w-16 bg-gray-200 rounded mb-1 animate-pulse" />
                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 세그먼트 리스트 */}
          {ok.length > 0 && (
            <div className="space-y-2 mb-4">
              {ok.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex-1 text-gray-600">
                    {s.seg.fromName} → {s.seg.toName}
                  </div>
                  <div className="text-right ml-2">
                    <div className="font-medium text-blue-600">{formatDistance(s.distance)}</div>
                    <div className="text-xs text-gray-500">{formatDuration(s.duration)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 총합 */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">총 거리:</span>
              <span className="font-bold text-lg text-blue-600">{formatDistance(totalDistance)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="font-semibold text-gray-800">총 시간:</span>
              <span className="font-bold text-lg text-green-600">{formatDuration(totalDuration)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapboxRecommendPage;

/* ==================== Helpers ==================== */

function segId(sid: string | number, eid: string | number) {
  return `route-${sid}-${eid}`;
}
function lineString(a: [number, number], b: [number, number]): GeoJSON.LineString {
  return { type: 'LineString', coordinates: [a, b] };
}
function addSeqMarker(map: mapboxgl.Map, stop: Stop) {
  const el = document.createElement('div');
  el.style.cssText = `
    background-color: #ff4444;
    color: white;
    width: 30px; height: 30px;
    border-radius: 50%; border: 3px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    display: flex; align-items: center; justify-content: center;
    font-weight: bold; font-size: 14px;
  `;
  el.textContent = String(stop.seq);
  new mapboxgl.Marker(el).setLngLat([stop.lng, stop.lat]).addTo(map);
}
function upsertLine(
  map: mapboxgl.Map,
  id: string,
  geometry: GeoJSON.LineString,
  solid: boolean
) {
  const src = map.getSource(id) as mapboxgl.GeoJSONSource | undefined;
  const data: GeoJSON.Feature<GeoJSON.LineString> = { type: 'Feature', properties: {}, geometry };

  if (!src) {
    map.addSource(id, { type: 'geojson', data });
    map.addLayer({
      id,
      type: 'line',
      source: id,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: solid
        ? { 'line-color': '#3b82f6', 'line-width': 4, 'line-opacity': 0.9 }
        : { 'line-color': '#94a3b8', 'line-width': 3, 'line-dasharray': [2, 2], 'line-opacity': 0.8 }
    });
  } else {
    src.setData(data);
    if (solid) {
      map.setPaintProperty(id, 'line-color', '#3b82f6');
      map.setPaintProperty(id, 'line-width', 4);
      map.setPaintProperty(id, 'line-dasharray', undefined as any);
      map.setPaintProperty(id, 'line-opacity', 0.9);
    } else {
      map.setPaintProperty(id, 'line-color', '#94a3b8');
      map.setPaintProperty(id, 'line-width', 3);
      map.setPaintProperty(id, 'line-dasharray', [2, 2]);
      map.setPaintProperty(id, 'line-opacity', 0.8);
    }
  }
}
function formatDistance(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${Math.round(m)}m`;
}
function formatDuration(sec: number) {
  return `${Math.round(sec / 60)}분`;
}
