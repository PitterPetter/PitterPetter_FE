import { Mapbox } from "../../shared/ui/Mapbox";
import { Button } from "../../shared/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [isClick, setIsClick] = useState(false);
  const navigation = useNavigate();
  useEffect(() => {
    if (isClick) {
      sessionStorage.setItem("token", "hi");
      if (sessionStorage.getItem("token") !== "firstLogin") {
        navigation("/");
      } else {
        navigation("/onboarding");
      }
    }
  }, [isClick]);
  return (
    <div className="relative w-full h-full flex">
      <div className="flex flex-col justify-center items-center min-w-[420px] h-full">
        <div className="text-sm text-gray-500">LoginPage</div>
        <div className="text-2xl font-bold">로그인</div>
        <Button className="text-sm text-gray-500" onClick={() => setIsClick(true)}>구글로 로그인</Button>
      </div>
      <Mapbox />
    </div>
  );
};