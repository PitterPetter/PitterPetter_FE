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

  const iconButtonClass = "flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white focus:outline-none focus:ring-1 focus:ring-[#662B2B]/40 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="absolute bottom-4 left-4 z-20 flex items-center justify-center flex-col gap-2 bg-white/80 p-3 py-4 rounded-lg shadow">
      <div className="grid grid-cols-2 gap-1 items-center justify-center w-full">
        <div
          className="flex items-center justify-center bg-white/90 text-gray-700 text-sm px-2 py-1 rounded-md shadow hover:bg-white focus:outline-none focus:ring-1 focus:ring-[#662B2B]/40 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleZoomChange(ZOOM_STEP)}
        >
          + Zoom
        </div>
        <div
          className="flex items-center justify-center bg-white/90 text-gray-700 text-sm px-2 py-1 rounded-md shadow hover:bg-white focus:outline-none focus:ring-1 focus:ring-[#662B2B]/40 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleZoomChange(-ZOOM_STEP)}
        >
          Zoom -
        </div>
        <div
          className="flex items-center justify-center bg-white/90 text-gray-700 text-sm px-2 py-1 rounded-md shadow hover:bg-white focus:outline-none focus:ring-1 focus:ring-[#662B2B]/40 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePitchChange(-PITCH_STEP)}
        >
          <FontAwesomeIcon icon={faArrowUp} className="text-[12px] px-[2px]" />
          Slope
        </div>
        <div
          className="flex items-center justify-center bg-white/90 text-gray-700 text-sm px-2 py-1 rounded-md shadow hover:bg-white focus:outline-none focus:ring-1 focus:ring-[#662B2B]/40 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePitchChange(PITCH_STEP)}
        >
          Slope
          <FontAwesomeIcon icon={faArrowDown} className="text-[12px] px-[2px]" />
        </div>

        <div
          className="flex items-center justify-center bg-white/90 text-gray-700 text-sm px-2 py-1 rounded-md shadow hover:bg-white focus:outline-none focus:ring-1 focus:ring-[#662B2B]/40 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleRotate(ROTATE_STEP)}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-[12px] px-[2px]" />
          Rotate
        </div>
        <div
          className="flex items-center justify-center bg-white/90 text-gray-700 text-sm px-2 py-1 rounded-md shadow hover:bg-white focus:outline-none focus:ring-1 focus:ring-[#662B2B]/40 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleRotate(-ROTATE_STEP)}
        >
          Rotate
          <FontAwesomeIcon icon={faArrowRight} className="text-[12px] px-[2px]" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 items-center justify-center">
        <span />
        <button type="button" className={iconButtonClass} onClick={() => handlePan(0.25, 0)} aria-label="Move forward" disabled={!isMapReady}>
          <FontAwesomeIcon icon={faAngleUp} className="text-xl" />
        </button>
        <span />
        <button type="button" className={iconButtonClass} onClick={() => handlePan(0, -0.25)} aria-label="Pan left" disabled={!isMapReady}>
          <FontAwesomeIcon icon={faAngleLeft} className="text-xl" />
        </button>
        <button type="button" className={iconButtonClass} onClick={handleResetView} aria-label="Reset view" disabled={!isMapReady}>
          <FontAwesomeIcon icon={faCircle} className="text-md" />
        </button>
        <button type="button" className={iconButtonClass} onClick={() => handlePan(0, 0.25)} aria-label="Pan right" disabled={!isMapReady}>
          <FontAwesomeIcon icon={faAngleRight} className="text-xl" />
        </button>
        <span />
        <button type="button" className={iconButtonClass} onClick={() => handlePan(-0.25, 0)} aria-label="Pan backward" disabled={!isMapReady}>
          <FontAwesomeIcon icon={faAngleDown} className="text-xl" />
        </button>
        <span />
      </div>
    </div>
  );
};

export default MapboxRemoteController;
