import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMarkerStore } from '../../shared/store/useAuthStore';
import { MapboxProps, MapRefs } from './type';
import course from '../../features/Course/mocks/course.json';

interface RouteSegment {
  from: string;
  to: string;
  distance: number; // meters
  duration: number; // seconds
}

const MapboxRecommendPage: React.FC<MapboxProps> = ({
  center = [course.items[0].stops[0].lng, course.items[0].stops[0].lat],
  zoom = 15,
  pitch = 0
}) => {
  const mapContainerRef = useRef<MapRefs['container']>(null);
  const mapRef = useRef<MapRefs['map']>(null);
  const { isMarkers, setIsMarkers } = useMarkerStore();
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

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
      
      course.items.forEach((item) => {
        // seq 순서대로 정렬
        const sortedStops = [...item.stops].sort((a, b) => a.seq - b.seq);
        
        // 마커 추가 (seq 번호 표시)
        sortedStops.forEach((stop, index) => {
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';
          markerElement.style.cssText = `
            background-color: #ff4444;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
          `;
          markerElement.textContent = stop.seq.toString();

          new mapboxgl.Marker(markerElement)
            .setLngLat([stop.lng, stop.lat])
            .addTo(map);
        });

        // 도보 루트 생성
        createWalkingRoute(sortedStops, map);
      });
    });

    // 도보 루트 생성 함수
    const createWalkingRoute = async (stops: any[], map: mapboxgl.Map) => {
      const segments: RouteSegment[] = [];
      let accumulatedDistance = 0;
      let accumulatedDuration = 0;

      for (let i = 0; i < stops.length - 1; i++) {
        const start = stops[i];
        const end = stops[i + 1];
        
        try {
          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/walking/${start.lng},${start.lat};${end.lng},${end.lat}?` +
            `geometries=geojson&access_token=${mapboxgl.accessToken}`
          );
          
          const data = await response.json();
          
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const distance = route.distance; // meters
            const duration = route.duration; // seconds
            
            // 세그먼트 정보 저장
            segments.push({
              from: start.name,
              to: end.name,
              distance,
              duration
            });
            
            accumulatedDistance += distance;
            accumulatedDuration += duration;
            
            // 루트 라인 추가
            map.addSource(`route-${start.seq}-${end.seq}`, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: route.geometry
              }
            });

            map.addLayer({
              id: `route-${start.seq}-${end.seq}`,
              type: 'line',
              source: `route-${start.seq}-${end.seq}`,
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#3b82f6',
                'line-width': 4,
                'line-opacity': 0.8
              }
            });
          }
        } catch (error) {
          console.error('루트 생성 실패:', error);
          
          // API 실패 시 직선으로 대체하고 추정 거리/시간 계산
          const estimatedDistance = calculateDistance(start.lat, start.lng, end.lat, end.lng);
          const estimatedDuration = estimatedDistance / 1.4; // 도보 속도 1.4m/s 가정
          
          segments.push({
            from: start.name,
            to: end.name,
            distance: estimatedDistance,
            duration: estimatedDuration
          });
          
          accumulatedDistance += estimatedDistance;
          accumulatedDuration += estimatedDuration;
          
          map.addSource(`fallback-route-${start.seq}-${end.seq}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [[start.lng, start.lat], [end.lng, end.lat]]
              }
            }
          });

          map.addLayer({
            id: `fallback-route-${start.seq}-${end.seq}`,
            type: 'line',
            source: `fallback-route-${start.seq}-${end.seq}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#94a3b8',
              'line-width': 3,
              'line-dasharray': [2, 2]
            }
          });
        }
      }
      
      // 상태 업데이트
      setRouteSegments(segments);
      setTotalDistance(accumulatedDistance);
      setTotalDuration(accumulatedDuration);
    };

    // 두 지점 간 거리 계산 (하버사인 공식)
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
      const R = 6371e3; // 지구 반지름 (미터)
      const φ1 = lat1 * Math.PI/180;
      const φ2 = lat2 * Math.PI/180;
      const Δφ = (lat2-lat1) * Math.PI/180;
      const Δλ = (lng2-lng1) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      return R * c;
    };

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // 시간 포맷팅 함수
  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    return `${minutes}분`;
  };

  // 거리 포맷팅 함수
  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}km`;
    }
    return `${Math.round(meters)}m`;
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <div
        ref={mapContainerRef}
        id="map"
        style={{ height: '100vh' }}
      />
      
      {/* 루트 정보 패널 */}
      {routeSegments.length > 0 && (
        <div 
          className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10"
          style={{ minWidth: '280px' }}
        >
          <h3 className="font-bold text-lg mb-3 text-gray-800">코스 정보</h3>
          
          {/* 개별 구간 정보 */}
          <div className="space-y-2 mb-4">
            {routeSegments.map((segment, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex-1">
                  <span className="text-gray-600">{segment.from} → {segment.to}</span>
                </div>
                <div className="text-right ml-2">
                  <div className="font-medium text-blue-600">
                    {formatDistance(segment.distance)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDuration(segment.duration)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 총 거리 및 시간 */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">총 거리:</span>
              <span className="font-bold text-lg text-blue-600">
                {formatDistance(totalDistance)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="font-semibold text-gray-800">총 시간:</span>
              <span className="font-bold text-lg text-green-600">
                {formatDuration(totalDuration)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapboxRecommendPage;
