import React from 'react';
import mapboxgl from 'mapbox-gl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight, faCircle, faAngleUp, faAngleDown, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { MapboxRemoteControllerProps } from '../types';


const MapboxRemoteController: React.FC<MapboxRemoteControllerProps> = ({
  mapRef,
  isMapReady,
  defaultViewRef
}) => {
  const PITCH_STEP = 5;
  const ZOOM_STEP = 0.5;
  const PAN_STEP = 0.01;
  const ROTATE_STEP = 10;

  const applyEase = (options: any) => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({ duration: 400, ...options });
  };

  const handleZoomChange = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    const nextZoom = Math.max(13, Math.min(18, map.getZoom() + delta));
    applyEase({ zoom: nextZoom });
  };

  const handlePitchChange = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    const nextPitch = Math.max(0, Math.min(80, map.getPitch() + delta));
    applyEase({ pitch: nextPitch });
  };

  const handleRotate = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    const nextBearing = map.getBearing() + delta;
    applyEase({ bearing: nextBearing });
  };

  const handlePan = (forward: number, strafe: number) => {
    const map = mapRef.current;
    if (!map) return;
    const current = map.getCenter();
    const bearingRad = (map.getBearing() * Math.PI) / 180;
    const sin = Math.sin(bearingRad);
    const cos = Math.cos(bearingRad);
    const deltaLng = forward * sin * PAN_STEP + strafe * cos * PAN_STEP;
    const diltaLat = forward * cos * PAN_STEP - strafe * sin * PAN_STEP;
    applyEase({ center: [current.lng + deltaLng, current.lat + diltaLat] });
  };

  const handleResetView = () => {
    const { center: defaultCenter, zoom: defaultZoom, pitch: defaultPitch, bearing: defaultBearing } = defaultViewRef.current;
    applyEase({ center: [...defaultCenter] as [number, number], zoom: defaultZoom, pitch: defaultPitch, bearing: defaultBearing, duration: 500 });
  };

  const iconButtonClass = "flex items-center justify-center w-10 h-10 rounded-xl bg-white/95 text-primary shadow-lg hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-primary/10";
  const controlButtonClass = "flex items-center justify-center gap-2 bg-white/95 text-primary text-sm px-3 py-2 rounded-xl shadow-lg hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-primary/10 font-medium";

  return (
    <div className="hidden xl:flex absolute bottom-6 left-6 z-20 flex flex-col gap-3 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20">
      {/* 상단 컨트롤 버튼들 */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={controlButtonClass}
          onClick={() => handleZoomChange(ZOOM_STEP)}
          disabled={!isMapReady}
        >
          <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
          확대
        </button>
        <button
          type="button"
          className={controlButtonClass}
          onClick={() => handleZoomChange(-ZOOM_STEP)}
          disabled={!isMapReady}
        >
          <FontAwesomeIcon icon={faArrowDown} className="text-xs" />
          축소
        </button>
        <button
          type="button"
          className={controlButtonClass}
          onClick={() => handlePitchChange(-PITCH_STEP)}
          disabled={!isMapReady}
        >
          <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
          기울기
        </button>
        <button
          type="button"
          className={controlButtonClass}
          onClick={() => handlePitchChange(PITCH_STEP)}
          disabled={!isMapReady}
        >
          <FontAwesomeIcon icon={faArrowDown} className="text-xs" />
          기울기
        </button>
      </div>

      {/* 방향 컨트롤 */}
      <div className="grid grid-cols-3 gap-2 items-center justify-center">
        <span />
        <button 
          type="button" 
          className={iconButtonClass} 
          onClick={() => handlePan(0.25, 0)} 
          aria-label="앞으로 이동" 
          disabled={!isMapReady}
        >
          <FontAwesomeIcon icon={faAngleUp} className="text-lg" />
        </button>
        <span />
        <button 
          type="button" 
          className={iconButtonClass} 
          onClick={() => handlePan(0, -0.25)} 
          aria-label="왼쪽으로 이동" 
          disabled={!isMapReady}
        >
          <FontAwesomeIcon icon={faAngleLeft} className="text-lg" />
        </button>
        <button 
          type="button" 
          className={`${iconButtonClass} bg-primary/10 text-primary hover:bg-primary/20`} 
          onClick={handleResetView} 
          aria-label="초기화" 
          disabled={!isMapReady}
        >
          <FontAwesomeIcon icon={faCircle} className="text-sm" />
        </button>
        <button 
          type="button" 
          className={iconButtonClass} 
          onClick={() => handlePan(0, 0.25)} 
          aria-label="오른쪽으로 이동" 
          disabled={!isMapReady}
        >
          <FontAwesomeIcon icon={faAngleRight} className="text-lg" />
        </button>
        <span />
        <button 
          type="button" 
          className={iconButtonClass} 
          onClick={() => handlePan(-0.25, 0)} 
          aria-label="뒤로 이동" 
          disabled={!isMapReady}
        >
          <FontAwesomeIcon icon={faAngleDown} className="text-lg" />
        </button>
        <span />
      </div>

      {/* 회전 컨트롤 */}
      <div className="flex gap-2">
        <button
          type="button"
          className={controlButtonClass}
          onClick={() => handleRotate(ROTATE_STEP)}
          disabled={!isMapReady}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          회전
        </button>
        <button
          type="button"
          className={controlButtonClass}
          onClick={() => handleRotate(-ROTATE_STEP)}
          disabled={!isMapReady}
        >
          회전
          <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default MapboxRemoteController;
