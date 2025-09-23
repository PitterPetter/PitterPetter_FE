import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHeart, faPhotoFilm } from "@fortawesome/free-solid-svg-icons";

export const SidebarLayout = () => {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-6 min-w-[260px] h-[calc(100vh-64px)]">
      <div className="sticky top-8 flex flex-col gap-6 justify-center items-center">
        <div className="p-8 w-[260px] h-[360px] z-10 flex flex-col items-start justify-center gap-4 border border-gray-300 rounded-2xl shadow-md">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-24 h-24 bg-gray-300 rounded-full mb-8 border-2 border-gray-300"></div>
          </div>
          <div onClick={() => {navigate("/mypage")}} className={`${pathname === "/mypage" ? "text-blue-500" : ""} cursor-pointer flex items-center justify-start gap-2`}>
            <FontAwesomeIcon icon={faUser} />
            Mypage
          </div>
          <div onClick={() => {navigate("/course")}} className={`${pathname === "/course" ? "text-blue-500" : ""} cursor-pointer flex items-center justify-start gap-2`}>
            <FontAwesomeIcon icon={faHeart} />
            Course List
            </div>
          <div onClick={() => {navigate("/diary")}} className={`${pathname === "/diary" ? "text-blue-500" : ""} cursor-pointer flex items-center justify-start gap-2`}>
            <FontAwesomeIcon icon={faPhotoFilm} />
            Couple Diary
          </div>
        </div>
        <button className="w-[100px] text-gray-200 bg-gray-900 rounded-md px-4 py-2" onClick={() => {navigate("/login")}}>Logout</button>
        </div>
    </div>
  );
};