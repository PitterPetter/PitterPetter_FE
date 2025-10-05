import { Outlet } from "react-router-dom";

export const CoupleRoomModal = () => {

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-50">
      <Outlet />
    </div>
  );
};