import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMarkerStore } from '../../shared/store/mapbox.store';
import { MapboxProps, MapRefs } from './type';
import mockData from '../../features/Diary/mocks/diary.json';

const MapboxMainPage: React.FC<MapboxProps> = ({
  center = [127.1, 37.5133],
  zoom = 15,
  pitch = 60
}) => {
  const mapContainerRef = useRef<MapRefs['container']>(null);
  const mapRef = useRef<MapRefs['map']>(null);
  const { setIsMarkers } = useMarkerStore();

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/standard',
      center,
      zoom,
      pitch,
      antialias: true
    });

    mapRef.current = map;

    // 팝업/마커 추적해서 클린업
    const popups: mapboxgl.Popup[] = [];
    let currentMarker: mapboxgl.Marker | null = null;

    // 스타일 로드 완료 후 스타일 조작
    const onStyleLoad = () => {
      if (!mapRef.current) return;

      // standard 스타일일 때만 basemap config 사용
      const styleUrl = map.getStyle()?.sprite || '';
      const isStandard = (map.getStyle() as any)?._metadata?.mapbox_style || styleUrl.includes('/standard');

      if (isStandard) {
        try {
          map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
          map.setConfigProperty('basemap', 'showPlaceLabels', false);
          map.setConfigProperty('basemap', 'showRoadLabels', false);
          map.setConfigProperty('basemap', 'showTransitLabels', false);
          map.setConfigProperty('basemap', 'show3dObjects', true);
          map.setConfigProperty('basemap', 'showLandmarks', true);
        } catch (e) {
          // 표준 스타일 변동 등으로 실패할 수 있으니 무시
          console.debug('[basemap config]', e);
        }
      }

      // 3D 건물 레이어( fill-extrusion )를 전부 노출
      const layers = map.getStyle().layers || [];
      layers
        .filter(l => l.type === 'fill-extrusion')
        .forEach(l => {
          try {
            map.setLayoutProperty(l.id, 'visibility', 'visible');
          } catch {}
        });

      // POI 라벨 레이어들 안전하게 숨김
      const landmarkLayers = [
        'poi-scalerank1',
        'poi-scalerank2',
        'poi-scalerank3',
        'poi-scalerank4-l1',
        'poi-scalerank4-l15'
      ];
      landmarkLayers.forEach(id => {
        if (map.getLayer(id)) {
          try {
            map.setLayoutProperty(id, 'visibility', 'none');
          } catch {}
        }
      });

      // 팝업 추가 (순수 CSS 호버 애니메이션)
      mockData.data.content.forEach((item: any) => {
        const popup = new mapboxgl.Popup({
          offset: 0,
          closeButton: false,
          closeOnClick: false,
          className: 'no-tail-popup'
        })
          .setLngLat([item.lng, item.lat])
          .setHTML(`
            <style>
              .no-tail-popup .mapboxgl-popup-tip { display: none !important; }
              .pp-card {
                position: relative;
                width: 180px;
                height: 40px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                gap: 8px;
                transition: height 0.3s ease;
              }
              .pp-card:hover { height: 100px; }
              .pp-title { font-weight: 700; font-size: 14px; margin: 0; }
              .pp-excerpt {
                font-size: 12px;
                margin: 0;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                opacity: 0;
                max-height: 0;
                transition: opacity 0.3s ease, max-height 0.3s ease;
              }
              .pp-card:hover .pp-excerpt { opacity: 1; max-height: 60px; }
              .pp-date {
                position: absolute;
                bottom: 8px;
                font-size: 12px;
                margin: 0;
              }
            </style>
            <div class="pp-card">
              <p class="pp-title">${item.title}</p>
              <p class="pp-excerpt">${item.excerpt}</p>
              <p class="pp-date">${String(item.updatedAt).split('T')[0]}</p>
            </div>
          `)
          .addTo(map);

        popups.push(popup);
      });
    };

    map.on('style.load', onStyleLoad);

    // 지오인터랙션
    const onMapLoad = () => {
      map.on('click', (e) => {
        // 이전 마커 제거
        if (currentMarker) {
          currentMarker.remove();
          currentMarker = null;
        }

        currentMarker = new mapboxgl.Marker({ color: '#ff4444' })
          .setLngLat(e.lngLat)
          .addTo(map);

        setIsMarkers(true);
        console.log('마커 좌표:', { longitude: e.lngLat.lng, latitude: e.lngLat.lat });

        map.easeTo({
          center: [e.lngLat.lng, e.lngLat.lat],
          pitch: 0,
          duration: 1000
        });
      });
    };

    map.once('load', onMapLoad);

    return () => {
      // 이벤트 해제
      map.off('style.load', onStyleLoad);
      map.off('load', onMapLoad);

      // 리소스 정리
      popups.forEach(p => p.remove());
      if (currentMarker) currentMarker.remove();

      map.remove();
      mapRef.current = null;
    };
  }, [center, pitch, zoom, setIsMarkers]);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      style={{ height: 'calc(100vh - 64px)', width: '100vw' }}
    />
  );
};

export default MapboxMainPage;
