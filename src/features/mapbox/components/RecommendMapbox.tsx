// 코스 상세 페이지에서 사용하는 Mapbox 페이지

import React, { useEffect, useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useQueries } from '@tanstack/react-query';
import { useUIStore } from '../../../shared/store/ui.store';
import { fetchRoute, routeQueryKey } from '../../../shared/api/routes.api';
import { MapboxProps, MapRefs, InputData } from '../types';
import { useRecommendStore } from '../../../shared/store/recommend.store';
import { Spinner } from '../../../shared/ui/spinner';

const MapboxRecommendPage: React.FC<MapboxProps> = ({
  center = [127.1, 37.5133],
  zoom = 15,
  pitch = 0,
  courseData
}) => {
  const mapContainerRef = useRef<MapRefs['container']>(null);
  const mapRef = useRef<MapRefs['map']>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const drawRetryTimerRef = useRef<number | null>(null);
  const drawRetryCountRef = useRef(0);
  const ignoreSelectedUntilRef = useRef(0);
  const lastDataKeyRef = useRef('');

  const dataRef = useRef<{
    displayData: InputData[];
    ok: Array<{ seg: { id: string; start: [number, number]; end: [number, number]; fromName: string; toName: string }, distance: number, duration: number, geometry: GeoJSON.LineString }>;
  }>({ displayData: [], ok: [] });

  const { data: recommendData, selectedPlace } = useRecommendStore();
  const { isMapReady, setMapReady } = useUIStore();
  
  const displayData = useMemo<InputData[] | any>(() => {
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;
    if (!displayData || displayData.length === 0) return;
  
    const valid = displayData.filter((v: any) =>
      Number.isFinite(v.lng) && Number.isFinite(v.lat)
    );
    if (valid.length === 0) return;

    const key = JSON.stringify(valid.map((v: any) => [v.seq, v.lng, v.lat]));
    if (key === lastDataKeyRef.current) return;
    lastDataKeyRef.current = key;
  
    const recenter = () => {
      if (!map.isStyleLoaded()) return;
      if (valid.length === 1) {
        map.flyTo({
          center: [valid[0].lng, valid[0].lat],
          zoom: 16,
          duration: 700,
          essential: true,
        });
        ignoreSelectedUntilRef.current = Date.now() + 1500;
        return;
      }
      const bounds = valid.reduce((b: mapboxgl.LngLatBounds, p: any) => {
        return b.extend([p.lng, p.lat]);
      }, new mapboxgl.LngLatBounds([valid[0].lng, valid[0].lat], [valid[0].lng, valid[0].lat]));
  
      map.fitBounds(bounds, { padding: 120, duration: 800 });
      ignoreSelectedUntilRef.current = Date.now() + 1500;
    };
  
    if (map.isStyleLoaded()) {
      recenter();
    } else {
      const once = () => { map.off('style.load', once); recenter(); };
      map.on('style.load', once);
    }
  }, [displayData, isMapReady]);

  const mapCenter = useMemo(() => {
    if (displayData && displayData.length > 0) {
      const validData = displayData.filter((v: any) => 
        typeof v.lng === 'number' && typeof v.lat === 'number' &&
        !isNaN(v.lng) && !isNaN(v.lat)
      );
      if (validData.length > 0) {
        const avgLng = validData.reduce((s: number, v: any) => s + v.lng, 0) / validData.length;
        const avgLat = validData.reduce((s: number, v: any) => s + v.lat, 0) / validData.length;
        if (!isNaN(avgLng) && !isNaN(avgLat)) {
          return [avgLng, avgLat] as [number, number];
        }
      }
    }
    return center;
  }, [displayData, center]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      config: {
        basemap: {
          lightPreset: 'day',
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
        return;
      }
      console.error('Map error:', e);
    });

    mapRef.current = map;

    const onLoad = () => setMapReady(true);
    map.once('load', onLoad);

    const onStyleLoad = () => {
      try {
        map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
        map.setConfigProperty('basemap', 'showPlaceLabels', false);
        map.setConfigProperty('basemap', 'showRoadLabels', false);
        map.setConfigProperty('basemap', 'showTransitLabels', false);
      } catch {}
      rebuildAll();
      forceEnsureSolidLines();
    };
    map.on('style.load', onStyleLoad);

    return () => {
      map.off('style.load', onStyleLoad);
      try {
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];
      } catch {}
      if (drawRetryTimerRef.current) {
        window.clearTimeout(drawRetryTimerRef.current);
        drawRetryTimerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [mapCenter.toString(), zoom, pitch, setMapReady]);

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

  const ok = results
    .map((r, i) => (r.isSuccess ? { seg: segments[i], ...r.data } : null))
    .filter(Boolean) as Array<{
      seg: (typeof segments)[number];
      distance: number;
      duration: number;
      geometry: GeoJSON.LineString;
    }>;

  useEffect(() => {
    dataRef.current.displayData = (displayData || []) as InputData[];
  }, [displayData]);
  useEffect(() => {
    dataRef.current.ok = ok;
  }, [ok]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;
    if (map.isStyleLoaded()) {
      rebuildAll();
      forceEnsureSolidLines();
    }
  }, [displayData, segments, isMapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;
  
    const drawSolids = () => {
      if (!map.isStyleLoaded()) return;
      ok.forEach(x => upsertLine(map, x.seg.id, x.geometry, true));
      forceEnsureSolidLines();
    };
  
    if (map.isStyleLoaded()) drawSolids();
    else {
      const once = () => { map.off('style.load', once); drawSolids(); };
      map.on('style.load', once);
    }
  }, [ok, isMapReady]);
  

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady || !selectedPlace) return;
    if (Date.now() < ignoreSelectedUntilRef.current) return;
    if (typeof selectedPlace.lng === 'number' && typeof selectedPlace.lat === 'number' &&
        !isNaN(selectedPlace.lng) && !isNaN(selectedPlace.lat)) {
      map.flyTo({
        center: [selectedPlace.lng, selectedPlace.lat],
        zoom: 17,
        duration: 1000,
        essential: true
      });
    }
  }, [selectedPlace, isMapReady]);

  const isAnyPending = results.some(r => r.isPending);
  const isAnyMissing = ok.length < segments.length;

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

      {(!isMapReady || isAnyPending || isAnyMissing) && (
        <div className="pointer-events-none absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-3">
          <Spinner />
          <span className="ml-0 text-gray-700 font-medium">경로 계산 중…</span>
        </div>
      )}
    </div>
  );

  function rebuildAll() {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
  
    try { markersRef.current.forEach(m => m.remove()); markersRef.current = []; } catch {}
    try {
      const style = map.getStyle();
      style?.layers?.forEach(l => { if (l.id.startsWith('route-')) map.getLayer(l.id) && map.removeLayer(l.id); });
      const srcs = style?.sources ? Object.keys(style.sources) : [];
      srcs.forEach(id => { if (id.startsWith('route-')) map.getSource(id) && map.removeSource(id); });
    } catch {}
  
    const list = (dataRef.current.displayData || [])
      .filter((v: any) => Number.isFinite(v.lng) && Number.isFinite(v.lat))
      .sort((a: InputData, b: InputData) => a.seq - b.seq);
  
    list.forEach(stop => {
      const marker = addSeqMarker(map, stop);
      markersRef.current.push(marker);
    });
  }

  function forceEnsureSolidLines() {
    const map = mapRef.current;
    if (!map) return;
    if (drawRetryTimerRef.current) {
      window.clearTimeout(drawRetryTimerRef.current);
      drawRetryTimerRef.current = null;
    }
    drawRetryCountRef.current = 0;

    const tick = () => {
      if (!mapRef.current) return;
      if (!map.isStyleLoaded()) {
        drawRetryTimerRef.current = window.setTimeout(tick, 300);
        return;
      }
      const missing = (dataRef.current.ok || []).filter(x => !map.getLayer(x.seg.id) || !map.getSource(x.seg.id));
      missing.forEach(x => upsertLine(map, x.seg.id, x.geometry, true));
      const stillMissing = (dataRef.current.ok || []).some(x => !map.getLayer(x.seg.id) || !map.getSource(x.seg.id));
      if (stillMissing && drawRetryCountRef.current < 10) {
        drawRetryCountRef.current += 1;
        drawRetryTimerRef.current = window.setTimeout(tick, 300);
      } else {
        if (drawRetryTimerRef.current) {
          window.clearTimeout(drawRetryTimerRef.current);
          drawRetryTimerRef.current = null;
        }
      }
    };

    tick();
  }
};

export default MapboxRecommendPage;

/* Helpers */

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
  const marker = new mapboxgl.Marker(el).setLngLat([stop.lng, stop.lat]).addTo(map);
  return marker;
}
function upsertLine(
  map: mapboxgl.Map,
  id: string,
  geometry: GeoJSON.LineString,
  solid: boolean
) {
  if (!map.isStyleLoaded()) {
    const once = () => { map.off('style.load', once); upsertLine(map, id, geometry, solid); };
    map.on('style.load', once);
    return;
  }

  const data: GeoJSON.Feature<GeoJSON.LineString> = { type: 'Feature', properties: {}, geometry };
  const src = map.getSource(id) as mapboxgl.GeoJSONSource | undefined;

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
