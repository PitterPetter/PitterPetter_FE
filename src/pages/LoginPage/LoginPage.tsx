import { Mapbox } from "../../shared/ui/Mapbox";
import { Button } from "../../shared/ui/button";

export const LoginPage = () => {

  return (
    <div className="relative w-full h-full flex">
      <div className="flex flex-col justify-center items-center min-w-[420px] h-full">
        <div className="text-sm text-gray-500">LoginPage</div>
        <div className="text-2xl font-bold">로그인</div>
        {/* 백엔드 구글 서버로 리다이랙트 */}
        <Button className="text-sm text-gray-500" onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`}>구글로 로그인</Button>
      </div>
      <Mapbox />
    </div>
  );
};