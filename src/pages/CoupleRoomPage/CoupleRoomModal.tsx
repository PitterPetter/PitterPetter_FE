import { Outlet } from "react-router-dom";

export const CoupleRoomModal = () => (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gradient-to-r from-rose-100 via-rose-100 to-white md:px-4 md:py-6 sm:items-center sm:px-6 lg:px-10">
    <Outlet />
  </div>
);
