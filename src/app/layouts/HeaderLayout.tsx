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
import { useHeaderStore } from "../../shared/store/header.store";

export const HeaderLayout = () => {
  const isOpen = useHeaderStore((state) => state.isOpen);
  const setIsOpen = useHeaderStore((state) => state.setIsOpen);

  return (
    <div className="flex w-full min-h-dvh">
      <div className="fixed inset-y-0 left -0 border-r border-gray-200 bg-white z-50">
        <Header />
      </div>
      <main className={`${isOpen ? "ml-[256px]" : "ml-[64px]"} w-full transition-all duration-300 ease-in-out`}>
        <Outlet />
      </main>
    </div>
  );
};

export const Header = () => {
  const isOpen = useHeaderStore((state) => state.isOpen);
  const setIsOpen = useHeaderStore((state) => state.setIsOpen);
  
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col h-full p-8 px-0 gap-8 ${isOpen ? "w-[256px]" : "w-[64px]"} transition-all duration-300 ease-in-out`}>
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
            flex h-[52px] items-center cursor-pointer
            ${isOpen ? "px-12 gap-4" : "px-4 justify-center gap-0"}
            hover:bg-gray-100 transition-all duration-300 ease-in-out
          `}
          onClick={() => {navigate("/home")}}
        >
          <img src={homeIcon} alt="home" className="w-[28px] h-[28px]" />
          <span
            className={`whitespace-nowrap overflow-hidden
              transition-all duration-200 ease-out
              ${isOpen ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0"}`}
          >
            홈
          </span>
        </div>
        <div
          className={`
            flex h-[52px] items-center cursor-pointer
            ${isOpen ? "px-12 gap-4" : "px-4 justify-center gap-0"}
            hover:bg-gray-100 transition-all duration-300 ease-in-out
          `}
          onClick={() => {navigate("/recommend")}}
        >
          <img src={shineIcon} alt="recommend" className="w-[28px] h-[28px]" />
          <span
            className={`whitespace-nowrap overflow-hidden
              transition-all duration-200 ease-out
              ${isOpen ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0"}`}
          >
            코스 추천
          </span>
        </div>
        <div
          className={`
            flex h-[52px] items-center cursor-pointer
            ${isOpen ? "px-12 gap-4" : "px-4 justify-center gap-0"}
            hover:bg-gray-100 transition-all duration-300 ease-in-out
          `}
          onClick={() => {navigate("/course")}}
        >
          <img src={pageIcon} alt="home" className="w-[28px] h-[28px]" />
          <span
            className={`whitespace-nowrap overflow-hidden
              transition-all duration-200 ease-out
              ${isOpen ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0"}`}
          >
            추억 블로그
          </span>
        </div>
        <div
          className={`
            flex h-[52px] items-center cursor-pointer
            ${isOpen ? "px-12 gap-4" : "px-4 justify-center gap-0"}
            hover:bg-gray-100 transition-all duration-300 ease-in-out
          `}
          onClick={() => {navigate("/diary")}}
        >
          <img src={bookIcon} alt="home" className="w-[28px] h-[28px]" />
          <span
            className={`whitespace-nowrap overflow-hidden
              transition-all duration-200 ease-out
              ${isOpen ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0"}`}
          >
            추억 다이어리
          </span>
        </div>
        <div
          className={`
            flex h-[52px] items-center cursor-pointer
            ${isOpen ? "px-12 gap-4" : "px-4 justify-center gap-0"}
            hover:bg-gray-100 transition-all duration-300 ease-in-out
          `}
          onClick={() => {navigate("/mypage")}}
        >
          <img src={userIcon} alt="home" className="w-[28px] h-[28px]" />
          <span
            className={`whitespace-nowrap overflow-hidden
              transition-all duration-200 ease-out
              ${isOpen ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0"}`}
          >
            마이페이지
          </span>
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