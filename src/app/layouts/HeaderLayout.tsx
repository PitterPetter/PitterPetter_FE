import { useState } from "react";
import { Outlet } from "react-router-dom";
import logo from "/logo.png";
import homeIcon from "../../shared/ui/assets/homeIcon.png";
import shineIcon from "../../shared/ui/assets/shineIcon.png";
import pageIcon from "../../shared/ui/assets/pageIcon.png";
import bookIcon from "../../shared/ui/assets/bookIcon.png";
import userIcon from "../../shared/ui/assets/userIcon.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export const HeaderLayout = () => {
  return (
    <div className="flex w-full min-h-dvh">
      <div className="fixed inset-y-0 left -0 border-r border-gray-200 bg-white">
        <Header />
      </div>
      <main className="p-8 ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`flex flex-col h-full p-8 px-0 gap-8 ${isOpen ? "w-64" : "w-18"} transition-all duration-300 ease-in-out`}>
      <div
        className={`
          flex items-center justify-start gap-2
          ${isOpen ? "px-12" : "px-4 justify-center"}
          cursor-pointer transition-all duration-300 ease-in-out
        `}
        onClick={() => {navigate("/home")}}
      >
        <img src={logo} alt="logo" className="w-8 h-8" />
        {isOpen && <p className="text-2xl font-bold">Loventure</p>}
      </div>
      <div className="flex flex-col w-full justify-center gap-0">
        <div
          className={`
            flex h-[52px] items-center gap-4 cursor-pointer
            ${isOpen ? "px-12" : "px-4 justify-center"}
            hover:bg-gray-100 transition-all duration-300 ease-in-out
          `}
          onClick={() => {navigate("/home")}}
        >
          <img src={homeIcon} alt="home" className="w-[28px] h-[28px]" />
          {isOpen && <p>홈</p>}
        </div>
        <div
          className={`
            flex h-[52px] items-center gap-4 cursor-pointer
            ${isOpen ? "px-12" : "px-4 justify-center"}
            hover:bg-gray-100 transition-all duration-300 ease-in-out
          `}
          onClick={() => {navigate("/recommend")}}
        >
          <img src={shineIcon} alt="recommend" className="w-[28px] h-[28px]" />
          {isOpen && <p>코스 추천</p>}
        </div>
        <div
          className={`
            flex h-[52px] items-center gap-4 cursor-pointer
            ${isOpen ? "px-12" : "px-4 justify-center"}
            hover:bg-gray-100 transition-all duration-300 ease-in-out
          `}
          onClick={() => {navigate("/course")}}
        >
          <img src={pageIcon} alt="home" className="w-[28px] h-[28px]" />
          {isOpen && <p>추억 블로그</p>}
        </div>
        <div
          className={`
            flex h-[52px] items-center gap-4 cursor-pointer
            ${isOpen ? "px-12" : "px-4 justify-center"}
            hover:bg-gray-100 transition-all duration-300 ease-in-out
          `}
          onClick={() => {navigate("/diary")}}
        >
          <img src={bookIcon} alt="home" className="w-[28px] h-[28px]" />
          {isOpen && <p>추억 다이어리</p>}
        </div>
        <div
          className={`
            flex h-[52px] items-center gap-4 cursor-pointer
            ${isOpen ? "px-12" : "px-4 justify-center"}
            hover:bg-gray-100 transition-all duration-300 ease-in-out
          `}
          onClick={() => {navigate("/mypage")}}
        >
          <img src={userIcon} alt="home" className="w-[28px] h-[28px]" />
          {isOpen && <p>마이페이지</p>}
        </div>
      </div>

      {/* isOpen 제어 버튼 */}
      <div
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 
                  flex w-8 h-8 items-center justify-center 
                  border rounded-full bg-white shadow cursor-pointer 
                  transition-colors duration-200 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
      </div>
    </div>
  );
};