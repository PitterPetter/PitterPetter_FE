import { Outlet } from "react-router-dom";
import { LoginMapbox } from "../../features/mapbox";

export const DistrictModal = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-50">
      <div className="absolute top-0 left-0 w-full h-[100vh] z-0 flex justify-center items-center overflow-hidden">
        <LoginMapbox />
      </div>
      <Outlet />
    </div>
  );
};
