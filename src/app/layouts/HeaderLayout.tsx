import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "/logo.png";
import homeIcon from "../../shared/ui/assets/homeIcon.png";
import shineIcon from "../../shared/ui/assets/shineIcon.png";
import pageIcon from "../../shared/ui/assets/pageIcon.png";
import bookIcon from "../../shared/ui/assets/bookIcon.png";
import userIcon from "../../shared/ui/assets/userIcon.png";
import { useHeaderStore } from "../../shared/store/header.store";

const NAV_ITEMS = [
  { to: "/home", key: "home", label: "홈", icon: homeIcon },
  { to: "/recommend", key: "recommend", label: "코스 추천", icon: shineIcon },
  { to: "/course", key: "course", label: "추억의 코스", icon: pageIcon },
  { to: "/diary", key: "diary", label: "추억 다이어리", icon: bookIcon },
  { to: "/mypage", key: "mypage", label: "마이페이지", icon: userIcon },
];

export const HeaderLayout = () => {
  const isOpen = useHeaderStore((s) => s.isOpen);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarWidth = 256;

  return (
    <div className="flex w-full min-h-dvh">
      {/* 데스크톱 사이드바 */}
      <aside
        className="hidden md:block fixed inset-y-0 left-0 border-r border-gray-200 bg-white z-50"
        style={{ width: sidebarWidth }}
      >
        <Header />
      </aside>

      {/* 모바일 상단 헤더 */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-[9990]">
        <MobileHeader 
          isMenuOpen={isMobileMenuOpen} 
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[80]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 모바일 메뉴 */}
      <div className={`md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-[100] transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <MobileMenu onItemClick={() => setIsMobileMenuOpen(false)} />
      </div>

      <main
        className="w-full transition-all duration-300 ease-in-out md:ml-64 pt-16 md:pt-0"
      >
        <Outlet />
      </main>
    </div>
  );
};

// 모바일 헤더 컴포넌트
const MobileHeader = ({ isMenuOpen, onMenuToggle }: { isMenuOpen: boolean; onMenuToggle: () => void }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-3 h-16">
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/home")}
        aria-label="Loventure 홈으로 이동"
      >
        <img src={logo} alt="Loventure 로고" className="w-8 h-8" />
        <p className="text-xl font-bold">Loventure</p>
      </div>
      
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
      >
        <svg
          className="w-6 h-6 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
};

// 모바일 메뉴 컴포넌트
const MobileMenu = ({ onItemClick }: { onItemClick: () => void }) => {
  return (
    <nav className="flex flex-col py-4 shadow-lg z-40">
      {NAV_ITEMS.map(({ to, label, icon, key }) => (
        <NavLink
          key={key}
          to={to}
          onClick={onItemClick}
          className={({ isActive }) =>
            `flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b ast:border-b-0
            ${isActive ? "bg-primary/10 text-primary font-medium border-l-4 border-l-primary" : "text-gray-700"}`
          }
          aria-label={label}
          end={to === "/home"}
        >
          <img
            src={icon}
            alt=""
            className="w-6 h-6"
            aria-hidden="true"
          />
          <span className="text-base font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export const Header = () => {
  const isOpen = useHeaderStore((s) => s.isOpen);
  const navigate = useNavigate();

  return (
    <div className={`relative flex flex-col h-full p-8 px-0 gap-8 ${isOpen ? "w-[256px]" : "w-[64px]"} transition-all duration-300 ease-in-out`}>
      <div
        className={`${isOpen ? "px-12" : "px-4 justify-center"} flex items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out`}
        onClick={() => navigate("/home")}
        aria-label="Loventure 홈으로 이동"
      >
        <img src={logo} alt="Loventure 로고" className="w-8 h-8" />
        {isOpen && <p className="text-2xl font-bold">Loventure</p>}
      </div>

      {/* 네비게이션 */}
      <nav className="flex flex-col w-full justify-center gap-0">
        {NAV_ITEMS.map(({ to, label, icon, key }) => (
          <NavLink
            key={key}
            to={to}
            className={({ isActive }) =>
              `flex h-[52px] items-center cursor-pointer transition-all duration-300 ease-in-out
              ${isOpen ? "px-12 gap-4" : "px-4 justify-center gap-0"}
              ${isActive ? "brightness-0 invert-[0.5] sepia-[1] saturate-[5] hue-rotate-[310deg] font-medium" : "hover:brightness-0 hover:invert-[0.3] hover:sepia-[1] hover:saturate-[5] hover:hue-rotate-[310deg]"}`
            }
            aria-label={label}
            end={to === "/home"}
          >
            {({ isActive }) => (
              <>
                <img
                  src={icon}
                  alt=""
                  className={`w-[28px] h-[28px] transition-all duration-300 ease-in-out
                    ${isActive ? "brightness-0 invert-[0.4] sepia-[1] saturate-[5] hue-rotate-[310deg]" : ""}`
                  }
                  aria-hidden="true"
                />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-200 ease-out
                    ${isOpen ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0"}`
                  }
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
