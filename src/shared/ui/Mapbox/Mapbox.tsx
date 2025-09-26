import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useUIStore } from '../../store/ui.store';
import { MapboxProps, MapRefs } from './types';

const Mapbox: React.FC<MapboxProps> = ({
  center = [127.1, 37.505],
  zoom = 15.5,
  pitch = 60
}) => {
  const mapContainerRef = useRef<MapRefs['container']>(null);
  const mapRef = useRef<MapRefs['map']>(null);
  const { setMapReady } = useUIStore();

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
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
      style={{ height: 'calc(100vh - 64px)', width: '100vw' }}
    />
  );
};

export default Mapbox;
