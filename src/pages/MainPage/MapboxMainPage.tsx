import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMarkerStore } from '../../shared/store/useAuthStore';

import { MapboxProps, MapRefs } from './type';

const MapboxMainPage: React.FC<MapboxProps> = ({
  center = [127.1, 37.5133],
  zoom = 15,
  pitch = 60
}) => {
  const mapContainerRef = useRef<MapRefs['container']>(null);
  const mapRef = useRef<MapRefs['map']>(null);
  const { isMarkers, setIsMarkers } = useMarkerStore();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center,
      zoom,
      pitch
    });

    mapRef.current.once('style.load', () => {
      const map = mapRef.current!;
      map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
      map.setConfigProperty('basemap', 'showPlaceLabels', false);
      map.setConfigProperty('basemap', 'showRoadLabels', false);
      map.setConfigProperty('basemap', 'showTransitLabels', false);
    });

    mapRef.current.once('load', () => {
      const map = mapRef.current!;
      let currentMarker: mapboxgl.Marker | null = null;

      map.on('click', (e) => {
        if (currentMarker) {
          currentMarker.remove();
        }

        currentMarker = new mapboxgl.Marker({
          color: '#ff4444'
        })
          .setLngLat(e.lngLat)
          .addTo(map);

        setIsMarkers(true);
        console.log('마커 좌표:', { longitude: e.lngLat.lng, latitude: e.lngLat.lat });
        console.log(e.lngLat);
        
        // 부드러운 pitch 애니메이션
        map.easeTo({
          pitch: 0,
          center: [e.lngLat.lng, e.lngLat.lat],
          duration: 1000 // 1초 동안 애니메이션
        });
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      style={{ height: '100vh', width: '100vw' }}
    />
  );
};

export default MapboxMainPage;
