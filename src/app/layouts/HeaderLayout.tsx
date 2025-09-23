import { Outlet } from "react-router-dom";

export const HeaderLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export const Header = () => {

  return (
    <div className="flex justify-between items-center w-full h-16 px-8">
      <a href="/" className="text-2xl font-bold">Loventure</a>
      <div className="flex gap-8">
        <a href="/">홈</a>
        <a href="/">코스 추천</a>
        <a href="/course">추억 블로그</a>
        <a href="/diary">추억 다이어리</a>
        <a href="/mypage">마이페이지</a>
      </div>
    </div>
  );
};