import React, { useRef } from 'react';
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
  const INTERVAL_DELAY = 50; // 50ms마다 실행
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // 버튼을 누르고 있을 때 반복 실행
  const startContinuousAction = (action: () => void) => {
    if (intervalRef.current) return; // 이미 실행 중이면 무시
    
    // 즉시 실행하지 않고 interval만 시작
    intervalRef.current = setInterval(action, INTERVAL_DELAY);
  };

  // 버튼에서 손을 떼면 중지
  const stopContinuousAction = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const iconButtonClass = "flex items-center justify-center w-10 h-10 rounded-xl bg-third/95 text-third shadow-lg hover:bg-third/80 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-third/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-third/10 text-white";
  const controlButtonClass = "flex items-center justify-center gap-2 bg-third/95 text-third text-sm px-3 py-2 rounded-xl shadow-lg hover:bg-third/80 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-third/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-third/10 font-medium text-white";

  return (
    <div className="hidden xl:flex absolute bottom-6 left-[280px] z-20 flex flex-col gap-3 backdrop-blur-md p-4 rounded-t-[40px] bg-none rounded-b-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/5">
      {/* 상단 컨트롤 버튼들 */}
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          className={controlButtonClass}
          onMouseDown={() => startContinuousAction(() => handleZoomChange(ZOOM_STEP * 0.3))}
          onMouseUp={stopContinuousAction}
          onMouseLeave={stopContinuousAction}
          onTouchStart={() => startContinuousAction(() => handleZoomChange(ZOOM_STEP * 0.3))}
          onTouchEnd={stopContinuousAction}
          disabled={!isMapReady}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 0 10px rgba(0,0,0,0.12)' }}
        >
          <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
          확대
        </button>
        <button
          type="button"
          className={controlButtonClass}
          onMouseDown={() => startContinuousAction(() => handleZoomChange(-ZOOM_STEP * 0.3))}
          onMouseUp={stopContinuousAction}
          onMouseLeave={stopContinuousAction}
          onTouchStart={() => startContinuousAction(() => handleZoomChange(-ZOOM_STEP * 0.3))}
          onTouchEnd={stopContinuousAction}
          disabled={!isMapReady}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 0 10px rgba(0,0,0,0.12)' }}
        >
          <FontAwesomeIcon icon={faArrowDown} className="text-xs" />
          축소
        </button>
        <button
          type="button"
          className={controlButtonClass}
          onMouseDown={() => startContinuousAction(() => handlePitchChange(-PITCH_STEP * 0.3))}
          onMouseUp={stopContinuousAction}
          onMouseLeave={stopContinuousAction}
          onTouchStart={() => startContinuousAction(() => handlePitchChange(-PITCH_STEP * 0.3))}
          onTouchEnd={stopContinuousAction}
          disabled={!isMapReady}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 0 10px rgba(0,0,0,0.12)' }}
        >
          <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
          기울기
        </button>
        <button
          type="button"
          className={controlButtonClass}
          onMouseDown={() => startContinuousAction(() => handlePitchChange(PITCH_STEP * 0.3))}
          onMouseUp={stopContinuousAction}
          onMouseLeave={stopContinuousAction}
          onTouchStart={() => startContinuousAction(() => handlePitchChange(PITCH_STEP * 0.3))}
          onTouchEnd={stopContinuousAction}
          disabled={!isMapReady}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 0 10px rgba(0,0,0,0.12)' }}
        >
          <FontAwesomeIcon icon={faArrowDown} className="text-xs" />
          기울기
        </button>
      </div>

      {/* 방향 컨트롤 */}
      <div className="grid grid-cols-3 gap-1 items-center justify-center">
        <span />
        <button 
          type="button" 
          className={iconButtonClass} 
          onMouseDown={() => startContinuousAction(() => handlePan(0.25, 0))}
          onMouseUp={stopContinuousAction}
          onMouseLeave={stopContinuousAction}
          onTouchStart={() => startContinuousAction(() => handlePan(0.25, 0))}
          onTouchEnd={stopContinuousAction}
          aria-label="앞으로 이동" 
          disabled={!isMapReady}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 0 10px rgba(0,0,0,0.12)' }}
        >
          <FontAwesomeIcon icon={faAngleUp} className="text-lg" />
        </button>
        <span />
        <button 
          type="button" 
          className={iconButtonClass} 
          onMouseDown={() => startContinuousAction(() => handlePan(0, -0.25))}
          onMouseUp={stopContinuousAction}
          onMouseLeave={stopContinuousAction}
          onTouchStart={() => startContinuousAction(() => handlePan(0, -0.25))}
          onTouchEnd={stopContinuousAction}
          aria-label="왼쪽으로 이동" 
          disabled={!isMapReady}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 0 10px rgba(0,0,0,0.12)' }}
        >
          <FontAwesomeIcon icon={faAngleLeft} className="text-lg" />
        </button>
        <button 
          type="button" 
          className={`${iconButtonClass} bg-primary/10 text-primary hover:bg-primary/20`} 
          onClick={handleResetView} 
          aria-label="초기화" 
          disabled={!isMapReady}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 0 10px rgba(0,0,0,0.12)' }}
        >
          <FontAwesomeIcon icon={faCircle} className="text-sm" />
        </button>
        <button 
          type="button" 
          className={iconButtonClass} 
          onMouseDown={() => startContinuousAction(() => handlePan(0, 0.25))}
          onMouseUp={stopContinuousAction}
          onMouseLeave={stopContinuousAction}
          onTouchStart={() => startContinuousAction(() => handlePan(0, 0.25))}
          onTouchEnd={stopContinuousAction}
          aria-label="오른쪽으로 이동" 
          disabled={!isMapReady}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 0 10px rgba(0,0,0,0.12)' }}
        >
          <FontAwesomeIcon icon={faAngleRight} className="text-lg" />
        </button>
        <span />
        <button 
          type="button" 
          className={iconButtonClass} 
          onMouseDown={() => startContinuousAction(() => handlePan(-0.25, 0))}
          onMouseUp={stopContinuousAction}
          onMouseLeave={stopContinuousAction}
          onTouchStart={() => startContinuousAction(() => handlePan(-0.25, 0))}
          onTouchEnd={stopContinuousAction}
          aria-label="뒤로 이동" 
          disabled={!isMapReady}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 0 10px rgba(0,0,0,0.12)' }}
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
          onMouseDown={() => startContinuousAction(() => handleRotate(ROTATE_STEP * 0.3))}
          onMouseUp={stopContinuousAction}
          onMouseLeave={stopContinuousAction}
          onTouchStart={() => startContinuousAction(() => handleRotate(ROTATE_STEP * 0.3))}
          onTouchEnd={stopContinuousAction}
          disabled={!isMapReady}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 0 10px rgba(0,0,0,0.12)' }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          회전
        </button>
        <button
          type="button"
          className={controlButtonClass}
          onMouseDown={() => startContinuousAction(() => handleRotate(-ROTATE_STEP * 0.3))}
          onMouseUp={stopContinuousAction}
          onMouseLeave={stopContinuousAction}
          onTouchStart={() => startContinuousAction(() => handleRotate(-ROTATE_STEP * 0.3))}
          onTouchEnd={stopContinuousAction}
          disabled={!isMapReady}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 0 10px rgba(0,0,0,0.12)' }}
        >
          회전
          <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default MapboxRemoteController;
