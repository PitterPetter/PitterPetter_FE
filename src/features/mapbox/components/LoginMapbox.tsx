import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useUIStore } from '../../../shared/store/ui.store';
import { MapboxProps, MapRefs } from '../types';

const Mapbox: React.FC<MapboxProps> = ({
  center = [127.1, 37.505],
  zoom = 15.5,
  pitch = 60
}) => {
  const mapContainerRef = useRef<MapRefs['container']>(null);
  const mapRef = useRef<MapRefs['map']>(null);
  const { isMapReady, setMapReady } = useUIStore();

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      // 시간에 따라 조명 프리셋 변경
      config: {
        basemap: {
          lightPreset: 'day',
        }
      },
      center,
      zoom,
      pitch,
      minZoom: 13,
      maxZoom: 18,
      interactive: false // 클릭 및 상호작용 비활성화
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
    
    let moveInterval: ReturnType<typeof setInterval> | null = null;

    // Mapbox 버전 확인
    mapRef.current.once('style.load', () => {
      const s = mapRef.current!.getStyle();
    });

    map.once('load', () => {
      setMapReady(true);

      let currentCenter = [127.1, 37.721] as [number, number];

      moveInterval = setInterval(() => {
        map.easeTo({
          center: currentCenter,
          duration: 400000
        });
      }, 100);
    })

    return () => {
      if (moveInterval) clearInterval(moveInterval);
      setMapReady(false);
      map.remove();
      mapRef.current = null;
    };
  }, [center.toString(), zoom, pitch, setMapReady]);

  return (
    <div style={{ position: 'relative', height: '110vh', width: '100vw' }}>
      <div
        ref={mapContainerRef}
        id="map"
        style={{ height: '100%', width: '100%' }}
      />
      
      {/* 로딩 오버레이 */}
      {!isMapReady && (
        <div className="pointer-events-none absolute inset-0 bg-white z-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-transparent" />
          <span className="ml-3 text-gray-700 font-medium">지도 로딩 중…</span>
        </div>
      )}
    </div>
  );
};

export default Mapbox;
