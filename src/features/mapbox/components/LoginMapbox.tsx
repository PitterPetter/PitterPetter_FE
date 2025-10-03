import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useUIStore } from '../../../shared/store/ui.store';
import { MapboxProps, MapRefs, TimeOfDay } from '../types';

const Mapbox: React.FC<MapboxProps> = ({
  center = [127.1, 37.505],
  zoom = 15.5,
  pitch = 60
}) => {
  const mapContainerRef = useRef<MapRefs['container']>(null);
  const mapRef = useRef<MapRefs['map']>(null);
  const { setMapReady } = useUIStore();
  const getTimeOfDay = (date = new Date()): TimeOfDay => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 9) return 'dawn';
    if (hour >= 9 && hour < 17) return 'day';
    if (hour >= 17 && hour < 21) return 'dusk';
    return 'night';
  }

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
          lightPreset: getTimeOfDay().toLowerCase() as 'dawn' | 'day' | 'dusk' | 'night',
        }
      },
      center,
      zoom,
      pitch,
      interactive: false // 클릭 및 상호작용 비활성화
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
      console.log('mapbox-gl version:', mapboxgl.version);
      console.log('style name:', s.name);
      console.log('sources:', s.sources);    // 여기서 lite / unexpected source가 있는지 확인
    });

    map.once('load', () => {
      setMapReady(true);

      let dir = 1;
      let currentCenter = [...center] as [number, number];

      moveInterval = setInterval(() => {
        const offset = 0.00003;
        if (currentCenter[1] > 37.521) dir = -1;
        if (currentCenter[1] < 37.505) dir = 1;
        currentCenter = [currentCenter[0], currentCenter[1] + dir * offset];

        map.easeTo({
          center: currentCenter,
          duration: 100
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
    <div
      ref={mapContainerRef}
      id="map"
      style={{ height: '100vh', width: '100vw' }}
    />
  );
};

export default Mapbox;
