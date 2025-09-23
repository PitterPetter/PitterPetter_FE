import { Outlet, useNavigate, useLocation } from "react-router-dom";

export const SidebarLayout = () => {
  return (
    <div className="flex h-[calc(100vh-64px)] mt-12 mx-32">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="flex justify-center min-w-[420px] h-[calc(100vh-64px)]">
      <div className="sticky top-8 p-8 w-[260px] h-[360px] z-10 flex flex-col items-center justify-center gap-4 border-2 border-gray-300 rounded-2xl">
        <div className="w-24 h-24 bg-gray-300 rounded-full mb-8 border-2 border-gray-300">
        </div>
        <div onClick={() => {navigate("/mypage")}} className={`${pathname === "/mypage" ? "text-blue-500" : ""} cursor-pointer`}>Mypage</div>
        <div onClick={() => {navigate("/course")}} className={`${pathname === "/course" ? "text-blue-500" : ""} cursor-pointer`}>Course List</div>
        <div onClick={() => {navigate("/diary")}} className={`${pathname === "/diary" ? "text-blue-500" : ""} cursor-pointer`}>Couple Diary</div>
      </div>
    </div>
  );
};