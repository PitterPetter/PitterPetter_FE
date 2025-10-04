import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMarkerStore } from '../../../shared/store/mapbox.store';
import { MapboxProps, MapRefs, TimeOfDay } from '../types';
import mockData from '../../diary/mocks/diary.json';
import { useStartStore } from '../../../shared/store/recommend.store';

const MapboxMainPage: React.FC<MapboxProps> = ({
  center = [127.1, 37.5133],
  zoom = 15,
  pitch = 60
}) => {
  const mapContainerRef = useRef<MapRefs['container']>(null);
  const mapRef = useRef<MapRefs['map']>(null);

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
    const features = (mockData.data?.content ?? []).map(
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
          offset: 0,
          closeButton: false,
          closeOnClick: false,
          className: 'no-tail-popup'
        })
          .setLngLat(
            (f.geometry as GeoJSON.Point).coordinates as [number, number]
          )
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
                <p class="text-md font-bold">${title}</p>
              </div>
              <p class="excerpt-text text-xs opacity-0 max-h-0 overflow-hidden 
                group-hover:opacity-100 group-hover:max-h-40
                transition-all duration-300">
                ${excerpt}
              </p>
              <p class="absolute bottom-2 text-xs">${String(updatedAt).split('T')[0]}</p>
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
          lightPreset: getTimeOfDay() as 'dawn' | 'day' | 'dusk' | 'night',
        },
      },
      center,
      zoom,
      pitch
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

