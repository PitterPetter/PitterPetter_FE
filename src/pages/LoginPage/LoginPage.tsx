import { LoginMapbox } from "../../features/Mapbox";
import { GoogleLoginButton } from "../../features/auth";

export const LoginPage = () => {

  return (
    <div className="relative w-full h-full flex">
      <div className="flex flex-col justify-center items-center min-w-[420px] h-full">
        <div className="text-sm text-gray-500">LoginPage</div>
        <div className="text-2xl font-bold">로그인</div>
        <GoogleLoginButton />
      </div>
      <LoginMapbox />
    </div>
  );
};