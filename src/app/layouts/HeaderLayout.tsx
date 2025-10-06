import { Outlet, NavLink, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import homeIcon from "../../shared/ui/assets/homeIcon.png";
import shineIcon from "../../shared/ui/assets/shineIcon.png";
import pageIcon from "../../shared/ui/assets/pageIcon.png";
import bookIcon from "../../shared/ui/assets/bookIcon.png";
import userIcon from "../../shared/ui/assets/userIcon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
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

  const sidebarWidth = isOpen ? 256 : 64;

  return (
    <div className="flex w-full min-h-dvh">
      <aside
        className="fixed inset-y-0 left-0 border-r border-gray-200 bg-white z-50"
        style={{ width: sidebarWidth }}
      >
        <Header />
      </aside>

      <main
        className="w-full transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export const Header = () => {
  const isOpen = useHeaderStore((s) => s.isOpen);
  const setIsOpen = useHeaderStore((s) => s.setIsOpen);
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


      {/* 열기/닫기 토글 */}
      <button
        type="button"
        aria-label={isOpen ? "사이드바 접기" : "사이드바 펼치기"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -right-4 -translate-y-1/2 flex w-8 h-8 items-center justify-center border rounded-full bg-white shadow transition-colors duration-200 hover:bg-gray-100"
      >
        <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
      </button>
    </div>
  );
};
