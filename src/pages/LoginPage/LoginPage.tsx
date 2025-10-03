import { PhotoStack } from "../../features/auth/components/PhotoStack";
import { LoginSubmit } from "../../features/auth/components/LoginSubmit";
import { LoginMapbox } from "../../features/mapbox";

export const LoginPage = () => {

  return (
    <div className="relative w-full h-[100vh] flex justify-center items-center">
      <div className="
        w-full h-full z-40 flex flex-col justify-center items-center bg-white/80 2xl:rounded-2xl px-20
        2xl:w-[1400px]
        xl:h-[700px]
        lg:h-[700px] lg:flex-row
      ">
        <div className="w-full h-full z-40 flex justify-center items-center">
          <PhotoStack />
        </div>
        <div className="w-full h-full z-40 flex justify-center items-center">
          <LoginSubmit />
        </div>
      </div>
      {/* background */}
      <div className="absolute top-0 left-0 w-full max-h-[100vh] z-10 flex justify-center items-center">
        <LoginMapbox />
      </div>
    </div>
  );
};