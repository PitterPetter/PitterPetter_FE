import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMarkerStore } from '../../../shared/store/mapbox.store';
import { MapboxProps, MapRefs, TimeOfDay } from '../types';
import { useStartStore } from '../../../shared/store/recommend.store';
import { useHeaderStore } from '../../../shared/store/header.store';
import { DistrictInfo } from '../../mypage/types';
import { mapboxApi } from '../api';
import { useDistrictStore as useDistrictSelectionStore } from '../../../shared/store/district.store';
import MapboxRemoteController from './MapboxRemoteController';
import { districtApi } from '../../district/api';
import { useQuery } from '@tanstack/react-query';

const MapboxMainPage: React.FC<MapboxProps> = ({
  center = [126.9839454596028, 37.552351790177854],
  zoom = 16,
  pitch = 62
}) => {
  const mapContainerRef = useRef<MapRefs['container']>(null);
  const mapRef = useRef<MapRefs['map']>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const { isOpen } = useHeaderStore();
  const { setIsMarkers } = useMarkerStore();
  const setSelectedDistrict = useDistrictSelectionStore((state) => state.setSelectedDistrict);
  const [initialLng, initialLat] = center;
  const defaultViewRef = useRef({
    center: [initialLng, initialLat] as [number, number],
    zoom,
    pitch,
    bearing: 0,
  });

  const popupMapRef = useRef<Map<number, mapboxgl.Popup>>(new Map());
  const districtDataRef = useRef<DistrictInfo[]>([]);

  const { data: districtLockData } = useQuery({
    queryKey: ['districtLockup'],
    queryFn: async () => {
      const response = await mapboxApi.getDistrictLockStatus();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const extractSeoulDistricts = (rawData: unknown): DistrictInfo[] => {
    const digForCities = (data: any): any[] => {
      if (!data || typeof data !== 'object') return [];
      if (Array.isArray(data.cities)) return data.cities;
      if (data.districts) return digForCities({ cities: data });
      if (data.data) return digForCities(data.data);
      return [];
    };

    const cities = digForCities(rawData);
    if (!Array.isArray(cities)) return [];

    const seoul = cities.find(
      (city: any) =>
        city &&
        typeof city === 'object' &&
        (city.cityName === '서울특별시' || city.cityName === '서울시')
    );

    if (!seoul || !Array.isArray(seoul.districts)) return [];

    return seoul.districts.map((district: any) => ({
      id: district.id,
      name: district.name,
      locked: Boolean(
        district.locked ??
          district.isLocked ??
          district?.status === 'LOCKED' ??
          district?.lockedAt
      ),
      description: district.description,
      lat: typeof district.lat === 'number' ? district.lat : undefined,
      lng: typeof district.lng === 'number' ? district.lng : undefined,
    }));
  };

  useEffect(() => {
    districtDataRef.current = extractSeoulDistricts(districtLockData);
  }, [districtLockData]);

  // districtLockMock 데이터 로드
  useEffect(() => {
    let isMounted = true;

    const loadDistricts = async () => {
      try {
        const response = await districtApi.getDistrictLock();
        if (!isMounted) return;

        const payload = response.data;
        districtDataRef.current = extractSeoulDistricts(payload);
      } catch (err) {
        console.error('[MainMapbox] Failed to load district lock data', err);
      }
    };

    void loadDistricts();

    return () => {
      isMounted = false;
    };
  }, []);

  type EaseOptions = Parameters<mapboxgl.Map['easeTo']>[0];

  // 좌표를 기반으로 지역구 찾기 (간단한 근사치)
  const findDistrictByCoordinates = (lat: number, lng: number): DistrictInfo | null => {
    // 서울시 경계 좌표 범위 체크
    const seoulBounds = {
      north: 37.7151,  // 도봉구 북쪽
      south: 37.4133,  // 금천구 남쪽
      east: 127.2693,  // 강동구 동쪽
      west: 126.7341   // 강서구 서쪽
    };

    // 서울시 범위를 벗어나면 null 반환
    if (lat < seoulBounds.south || lat > seoulBounds.north || 
        lng < seoulBounds.west || lng > seoulBounds.east) {
      return null;
    }

    let closestDistrict: DistrictInfo | null = null;
    let minDistance = Infinity;

    for (const district of districtDataRef.current) {
      if (typeof district.lat !== 'number' || typeof district.lng !== 'number') {
        continue;
      }

      const distance = Math.hypot(lat - district.lat, lng - district.lng);
      if (distance < minDistance) {
        minDistance = distance;
        closestDistrict = district;
      }
    }

    return closestDistrict;
  };


  const makeFeatureCollection = () => {
    // 빈 FeatureCollection 반환
    return {
      type: 'FeatureCollection' as const,
      features: []
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
          offset: 15 + (pitch * 0.5),
          closeButton: false,
          closeOnClick: false,
          className: 'custom-popup',
          anchor: 'bottom',
          maxWidth: 'none'
        })
          .setLngLat(
            (f.geometry as GeoJSON.Point).coordinates as [number, number]
          )
          .setHTML(`
            <style>
              .custom-popup .mapboxgl-popup-tip { display: none !important; }
              .custom-popup {
                z-index: 1;
              }
              .custom-popup:hover {
                z-index: 9999 !important;
              }
              .custom-popup .mapboxgl-popup-content {
                background: rgba(255, 255, 255, 0.25) !important;
                backdrop-filter: blur(10px);
                border-radius: 12px !important;
                padding: 16px !important;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
                border: 1px solid rgba(255, 255, 255, 0.3);
                transition: box-shadow 0.2s ease;
              }
              .custom-popup:hover .mapboxgl-popup-content {
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25) !important;
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

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      config: {
        basemap: {
          lightPreset: 'day',
        },
      },
      center,
      zoom,
      pitch,
      bearing: 340,
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

      // 클러스터 활성화 (pitch에 따라 동적 조정)
      map.addSource('posts', {
        type: 'geojson',
        data: makeFeatureCollection(),
        cluster: true,
        clusterRadius: 270 + Math.round((90 - pitch) * 2),
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

      map.on('mouseenter', 'cluster-circles', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'cluster-circles', () => {
        map.getCanvas().style.cursor = '';
      });
      
      map.on('click', 'cluster-circles', (e) => {
        e.preventDefault();
        if (e.originalEvent) {
          e.originalEvent.stopPropagation();
        }

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

      const update = () => {
        syncAlwaysOnPopups();
      };
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
      const initialCenter = map.getCenter();
      defaultViewRef.current = {
        center: [initialCenter.lng, initialCenter.lat] as [number, number],
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      };

      let currentMarker: mapboxgl.Marker | null = null;

      map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['cluster-circles']
        });
        
        if (features.length > 0) return;

        // 기존 마커 제거
        if (currentMarker) currentMarker.remove();

        // 새로운 마커 생성
        currentMarker = new mapboxgl.Marker({ 
          color: '#ff4444',
          scale: 1.2
        })
          .setLngLat(e.lngLat)
          .addTo(map);

        setIsMarkers(true);
        useStartStore.setState({ lat: e.lngLat.lat, lng: e.lngLat.lng });

        // 클릭한 좌표의 지역구 찾기
        const district = findDistrictByCoordinates(e.lngLat.lat, e.lngLat.lng);
        if (district) {
          setSelectedDistrict(district);
        } else {
          setSelectedDistrict(null);
        }

        map.easeTo({
          pitch: 0,
          center: [e.lngLat.lng, e.lngLat.lat],
          zoom: 17,
          bearing: 0,
          duration: 1000
        });
      });
    });

    return () => {
      for (const [, popup] of popupMapRef.current.entries()) {
        popup.remove();
      }
      popupMapRef.current.clear();

      map.remove();
      mapRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  useEffect(() => {
    mapRef.current?.resize();
  }, [isOpen]);

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      maxWidth: isOpen ? 'w-100vw md:calc(100vw - 256px)' : 'calc(100vw - 64px)',
      overflow: 'hidden'
    }}>
      <div
        ref={mapContainerRef}
        id="map"
        style={{ height: '110vh', width: isOpen ? 'w-100vw md:calc(100vw - 256px)' : 'calc(100vw - 64px)' }}
      />

      <MapboxRemoteController 
        mapRef={mapRef}
        isMapReady={isMapReady}
        defaultViewRef={defaultViewRef}
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