import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMarkerStore } from '../../../shared/store/mapbox.store';
import { MapboxProps, MapRefs } from '../types';
import mockData from '../../diary/mocks/diary.json';


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

    mapRef.current.on('style.load', () => {
      const map = mapRef.current!;
      map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
      map.setConfigProperty('basemap', 'showPlaceLabels', false);
      map.setConfigProperty('basemap', 'showRoadLabels', false);
      map.setConfigProperty('basemap', 'showTransitLabels', false);

      mockData.data.content.forEach((item) => {
        const postPopup = new mapboxgl.Popup({
          offset: 0,
          closeButton: false,
          closeOnClick: false,
          className: 'no-tail-popup'
        })
          .setLngLat([item.lng, item.lat])
          .setHTML(`
            <style>
              .no-tail-popup .mapboxgl-popup-tip { display: none !important; }
              .excerpt-text {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            </style>
            <div class="group flex flex-col gap-2 h-[40px] hover:h-[100px] transition-all duration-300 w-[180px]">
              <div class="w-full">
                <p class="text-md font-bold">${item.title}</p>
              </div>
              <p class="excerpt-text text-xs opacity-0 max-h-0 overflow-hidden 
                group-hover:opacity-100 group-hover:max-h-40
                transition-all duration-300">
                ${item.excerpt}
              </p>
              <p class="absolute bottom-2 text-xs">${item.updatedAt.split('T')[0]}</p>
            </div>
          `)
          .addTo(map);
      })

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
          duration: 1000
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
      style={{ height: 'calc(100vh - 64px)', width: '100vw' }}
    />
  );
};

export default MapboxMainPage;

