// 코스 상세 페이지에서 사용하는 Mapbox 페이지

import React, { useEffect, useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useQueries } from '@tanstack/react-query';
import { useUIStore } from '../../../shared/store/ui.store';
import { fetchRoute, routeQueryKey } from '../../../shared/api/routes.api';
import { MapboxProps, MapRefs, InputData, TimeOfDay } from '../types';
import { useRecommendStore } from '../../../shared/store/recommend.store';
import { useHeaderStore } from '../../../shared/store/header.store';

const MapboxRecommendPage: React.FC<MapboxProps> = ({
  center = [127.1, 37.5133],
  zoom = 15,
  pitch = 0,
  courseData
}) => {
  const mapContainerRef = useRef<MapRefs['container']>(null);
  const mapRef = useRef<MapRefs['map']>(null);
  const { data: recommendData } = useRecommendStore();
  const { isMapReady, setMapReady } = useUIStore();
  const { isOpen } = useHeaderStore();
  
  // courseData가 있으면 우선 사용, 없으면 recommendData 사용
  const displayData = useMemo(() => {
    if (courseData?.poi_list) {
      return courseData.poi_list.map((poiSet: any) => ({
        id: poiSet.poi.poi_id,
        name: poiSet.poi.name,
        category: poiSet.poi.category,
        lat: poiSet.poi.lat,
        lng: poiSet.poi.lng,
        seq: poiSet.order,
        indoor: poiSet.poi.indoor,
        price_level: poiSet.poi.price_level,
        alcohol: poiSet.poi.alcohol,
        mood_tag: poiSet.poi.mood_tag,
      }));
    }
    return recommendData;
  }, [courseData, recommendData]);
  const getTimeOfDay = (date = new Date()): TimeOfDay => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 9) return 'dawn';
    if (hour >= 9 && hour < 17) return 'day';
    if (hour >= 17 && hour < 21) return 'dusk';
    return 'night';
  }

  // 데이터가 있을 때만 center 계산
  const mapCenter = useMemo(() => {
    if (displayData && displayData.length > 0) {
      const avgLng = displayData.reduce((s: number, v: any) => s + v.lng, 0) / displayData.length;
      const avgLat = displayData.reduce((s: number, v: any) => s + v.lat, 0) / displayData.length;
      return [avgLng, avgLat] as [number, number];
    }
    return center;
  }, [displayData, center]);

  // 1) 맵 초기화 + 마커/임시 점선(직선)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      // 시간에 따라 조명 프리셋 변경
      config: {
        basemap: {
          lightPreset: getTimeOfDay().toLowerCase() as 'dawn' | 'day' | 'dusk' | 'night',
        }
      },
      center: mapCenter,
      zoom,
      pitch,
      minZoom: 13,
      maxZoom: 18
    });

    map.on('error', (e) => {
      if (e.error?.message?.includes('meshes is not iterable')) {
        console.debug('3D mesh error suppressed (map works fine)');
        return;
      }
      console.error('Map error:', e);
    });

    mapRef.current = map;

    map.once('style.load', () => {
      map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
      map.setConfigProperty('basemap', 'showPlaceLabels', false);
      map.setConfigProperty('basemap', 'showRoadLabels', false);
      map.setConfigProperty('basemap', 'showTransitLabels', false);
    });

    map.on('load', () => {
      setMapReady(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [mapCenter.toString(), zoom, pitch, setMapReady]);

  // displayData가 변경될 때 마커와 라인 업데이트
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;
    
    const map = mapRef.current;
    
    // 기존 마커와 라인 제거
    map.getStyle().layers?.forEach(layer => {
      if (layer.id.includes('marker') || layer.id.includes('line')) {
        if (map.getLayer(layer.id)) {
          map.removeLayer(layer.id);
        }
      }
    });
    
    map.getStyle().sources && Object.keys(map.getStyle().sources).forEach(sourceId => {
      if (sourceId.includes('marker') || sourceId.includes('line')) {
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      }
    });

    // 새로운 마커와 라인 추가
    if (displayData && displayData.length > 0) {
      const sorted: InputData[] = [...displayData].sort((a, b) => a.seq - b.seq);

      sorted.forEach(stop => addSeqMarker(map, stop));

      for (let i = 0; i < sorted.length - 1; i++) {
        const s = sorted[i], e = sorted[i + 1];
        upsertLine(map, segId(s.seq, e.seq), lineString([s.lng, s.lat], [e.lng, e.lat]), false);
      }
    }
  }, [displayData, isMapReady]);

  // 2) 세그먼트 목록
  const segments = useMemo(() => {
    const arr: {
      id: string;
      start: [number, number];
      end: [number, number];
      fromName: string;
      toName: string;
    }[] = [];

    if (displayData && displayData.length > 0) {
      const stops: InputData[] = [...displayData].sort((a, b) => a.seq - b.seq);
      for (let i = 0; i < stops.length - 1; i++) {
        const s = stops[i], e = stops[i + 1];
        arr.push({
          id: segId(s.seq, e.seq),
          start: [s.lng, s.lat],
          end: [e.lng, e.lat],
          fromName: s.name,
          toName: e.name
        });
      }
    }
    return arr;
  }, [displayData]);

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
    <div style={{ 
      position: 'relative', 
      height: '100vh', 
      width: '100vw',
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      <div 
        ref={mapContainerRef} 
        id="map" 
        style={{ 
          height: '100%',
          width: '100%',
          transition: 'all 0.3s ease-in-out'
        }} 
      />

      {/* 전역 오버레이 */}
      {(!isMapReady || isAnyPending) && (
        <div className="pointer-events-none absolute inset-0 bg-white z-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-transparent" />
          <span className="ml-3 text-gray-700 font-medium">경로 계산 중…</span>
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
function addSeqMarker(map: mapboxgl.Map, stop: InputData) {
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
