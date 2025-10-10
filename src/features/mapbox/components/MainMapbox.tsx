import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMarkerStore } from '../../../shared/store/mapbox.store';
import { MapboxProps, MapRefs, TimeOfDay } from '../types';
import { mapboxApi } from '../api';
import { useStartStore } from '../../../shared/store/recommend.store';
import { useHeaderStore } from '../../../shared/store/header.store';

const MapboxMainPage: React.FC<MapboxProps> = ({
  center = [127.104, 37.505],
  zoom = 16,
  pitch = 60
}) => {
  const mapContainerRef = useRef<MapRefs['container']>(null);
  const mapRef = useRef<MapRefs['map']>(null);
  const [mapData, setMapData] = useState<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const { isOpen } = useHeaderStore();
  const { setIsMarkers } = useMarkerStore();

  const popupMapRef = useRef<Map<number, mapboxgl.Popup>>(new Map());

  const getTimeOfDay = (date = new Date()): TimeOfDay => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 9) return 'dawn';
    if (hour >= 9 && hour < 17) return 'day';
    if (hour >= 17 && hour < 21) return 'dusk';
    return 'night';
  };

  const makeFeatureCollection = () => {
    const features = (mapData?.data?.content ?? []).map(
      (
        item: {
          lng: number;
          lat: number;
          title: string;
          excerpt: string;
          updatedAt: string;
        },
        idx: number
      ) => ({
        type: 'Feature' as const,
        id: idx,
        properties: {
          title: item.title,
          excerpt: item.excerpt,
          updatedAt: item.updatedAt,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [item.lng, item.lat]
        }
      })
    );
    return {
      type: 'FeatureCollection' as const,
      features
    };
  };

  const syncAlwaysOnPopups = () => {
    const map = mapRef.current;
    if (!map) return;

    const unclustered = map.querySourceFeatures('posts', {
      filter: ['!', ['has', 'point_count']]
    });

    const visibleIds = new Set<number>();
    for (const f of unclustered) {
      const id = (f.id ?? f.properties?.id) as number | undefined;
      if (typeof id !== 'number') continue;
      visibleIds.add(id);

      if (!popupMapRef.current.has(id)) {
        const { title, excerpt, updatedAt } = f.properties as {
          title: string;
          excerpt: string;
          updatedAt: string;
        };

        const popup = new mapboxgl.Popup({
          offset: 15,
          closeButton: false,
          closeOnClick: false,
          className: 'custom-popup'
        })
          .setLngLat(
            (f.geometry as GeoJSON.Point).coordinates as [number, number]
          )
          .setHTML(`
            <style>
              .custom-popup .mapboxgl-popup-tip { display: none !important; }
              .custom-popup .mapboxgl-popup-content {
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(10px);
                border-radius: 12px !important;
                padding: 16px !important;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
                border: 1px solid rgba(255, 255, 255, 0.3);
              }
              .popup-container {
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              }
              .excerpt-text {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.5;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                -webkit-line-clamp: 2;
                max-height: 42px;
              }
              .group:hover .excerpt-text {
                -webkit-line-clamp: 4;
                max-height: 84px;
              }
              .popup-title {
                color: #1f2937;
                margin-bottom: 8px;
              }
              .popup-date {
                color: #6b7280;
                font-size: 11px;
                transition: opacity 0.3s ease;
              }
              .popup-excerpt {
                color: #4b5563;
                margin-bottom: 8px;
              }
              .popup-button {
                background: #ff4444;
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                text-align: center;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 8px;
                opacity: 0;
                max-height: 0;
                overflow: hidden;
                transform: translateY(-10px);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                text-decoration: none;
                display: block;
              }
              .popup-button:hover {
                background: #e63939;
              }
              .group:hover .popup-button {
                opacity: 1;
                max-height: 50px;
                transform: translateY(0);
              }
            </style>
            <div class="group popup-container flex flex-col w-[220px]">
              <div class="w-full">
                <p class="popup-title text-md font-bold">${title}</p>
              </div>
              <p class="popup-excerpt excerpt-text text-xs">
                ${excerpt}
              </p>
              <p class="popup-date text-right mb-2">${String(updatedAt).split('T')[0]}</p>
              <a href="/diary/${id}" class="popup-button">다이어리 보기 →</a>
            </div>
          `)
          .addTo(map);

        popupMapRef.current.set(id, popup);
      } else {
        const popup = popupMapRef.current.get(id)!;
        const coords = (f.geometry as GeoJSON.Point).coordinates as [
          number,
          number
        ];
        popup.setLngLat(coords);
      }
    }

    for (const [id, popup] of popupMapRef.current.entries()) {
      if (!visibleIds.has(id)) {
        popup.remove();
        popupMapRef.current.delete(id);
      }
    }
  };

  // 데이터 로드
  useEffect(() => {
    const loadMapData = async () => {
      try {
        const response = await mapboxApi.getMapboxData();
        setMapData(response.data);
      } catch (error) {
        console.error('Failed to load map data:', error);
      }
    };
    loadMapData();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || !mapData) return;
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      config: {
        basemap: {
          lightPreset: getTimeOfDay() as 'dawn' | 'day' | 'dusk' | 'night',
        },
      },
      center,
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

    map.on('style.load', () => {
      map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
      map.setConfigProperty('basemap', 'showPlaceLabels', false);
      map.setConfigProperty('basemap', 'showRoadLabels', false);
      map.setConfigProperty('basemap', 'showTransitLabels', false);

      // 클러스터 활성화
      map.addSource('posts', {
        type: 'geojson',
        data: makeFeatureCollection(),
        cluster: true,
        clusterRadius: 200, // 묶이는 범위
        clusterMaxZoom: 18
      });

      // 클러스터
      map.addLayer({
        id: 'cluster-circles',
        type: 'circle',
        source: 'posts',
        filter: ['has', 'point_count'],
        paint: {
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            16,
            10,
            22,
            25,
            28,
          ],
          'circle-color': '#ff4444',
          'circle-opacity': 0.9
        }
      });

      // 클러스터 숫자
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'posts',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count'],
          'text-size': 12,
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold']
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      // 클러스터 클릭 시 확대
      map.on('click', 'cluster-circles', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['cluster-circles']
        });
        const clusterId = features[0]?.properties?.cluster_id;
        const src = map.getSource('posts') as mapboxgl.GeoJSONSource;
        if (!src || typeof clusterId !== 'number') return;

        src.getClusterExpansionZoom(clusterId, (err, zoomTo) => {
          if (err) return;
          map.easeTo({
            center: (features[0].geometry as any).coordinates,
            zoom: zoomTo ?? 15,
            duration: 500
          });
        });
      });

      const update = () => syncAlwaysOnPopups();
      map.on('moveend', update);
      map.on('sourcedata', (ev: mapboxgl.MapSourceDataEvent) => {
        if (ev.sourceId === 'posts' && ev.isSourceLoaded && ev.sourceDataType !== 'metadata') {
          syncAlwaysOnPopups();
        }
      });

      map.once('idle', () => {
        syncAlwaysOnPopups();
        setIsMapReady(true);
      });

    });

    map.once('load', () => {
      let currentMarker: mapboxgl.Marker | null = null;

      map.on('click', (e) => {
        if (currentMarker) currentMarker.remove();

        currentMarker = new mapboxgl.Marker({ color: '#ff4444' })
          .setLngLat(e.lngLat)
          .addTo(map);

        setIsMarkers(true);
        useStartStore.setState({ lat: e.lngLat.lat, lng: e.lngLat.lng });

        map.easeTo({
          pitch: 0,
          center: [e.lngLat.lng, e.lngLat.lat],
          duration: 1000
        });
      });
    });

    return () => {
      for (const [, popup] of popupMapRef.current.entries()) {
        popup.remove();
      }
      popupMapRef.current.clear();

      mapRef.current?.remove();
      mapRef.current = null;
      setIsMapReady(false);
    };
  }, [mapData, isOpen]);

  return (
    <div style={{ 
      position: 'relative', 
      height: '100vh', 
      width: '100vw', 
      maxWidth: isOpen ? 'calc(100vw - 256px)' : 'calc(100vw - 64px)',
      overflow: 'hidden'
    }}>
      <div
        ref={mapContainerRef}
        id="map"
        style={{ height: '110vh', width: isOpen ? 'calc(100vw - 256px)' : 'calc(100vw - 64px)' }}
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

export default MapboxMainPage;

