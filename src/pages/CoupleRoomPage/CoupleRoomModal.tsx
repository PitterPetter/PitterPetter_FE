import { Outlet } from "react-router-dom";
import { LoginMapbox } from "../../features/mapbox";
import { useUIStore } from "../../shared/store/ui.store";

export const CoupleRoomModal = () => {
  const { isMapReady } = useUIStore();
  return (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gradient-to-r from-rose-100 via-rose-100 to-white md:px-4 md:py-6 sm:items-center sm:px-6 lg:px-10">
    <div className="absolute top-0 left-0 w-full h-[100vh] z-0 flex justify-center items-center overflow-hidden">
      <LoginMapbox />
    </div>
    {isMapReady && (
      <Outlet />
    )}
  </div>
  );
};
