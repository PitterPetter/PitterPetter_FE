import { PhotoStack } from "../../features/auth/components/PhotoStack";
import { LoginSubmit } from "../../features/auth/components/LoginSubmit";
import { LoginMapbox } from "../../features/mapbox";

export const LoginPage = () => {

  return (
    <div className="relative w-full h-[100vh] flex justify-center items-center">
      <div className="
        w-full 2xl:w-[1400px] h-full z-40 flex flex-col justify-center items-center gap-10 bg-white/80 2xl:rounded-2xl px-10
        xl:h-[700px] xl:px-20
        lg:h-[700px] lg:flex-row lg:gap-20
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