import { GoogleLoginButton } from "./GoogleLoginButton";
import logo from "/logo.png";
import { KakaoLoginButton } from "./KakaoLoginButton";

export const LoginSubmit = () => {
  const texts = [
    "- 두 사람 만의 특별한 공간",
    "- 다양한 추억들",
    "- 하나의 기록",
  ];

  return (
    <div className="flex flex-col justify-end items-center w-[450px] h-[300px] gap-10">
      <div className="flex flex-col justify-center items-center pb-4 md:py-4">
        <div className="flex justify-center items-center gap-2">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <div className="text-3xl font-bold text-gray-500">Loventure</div>
        </div>

        {/* 무한 롤링 */}
        <div className="h-28 overflow-hidden my-4 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%]">
          <div className="flex flex-col animate-scrollText">
            {[...texts, ...texts].map((text, i) => (
              <p
                key={i}
                className="text-md font-bold text-gray-500 h-10 flex justify-center items-center"
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col w-[240px] justify-center items-center gap-4">
        <div className="flex items-center w-full">
          <div className="flex-grow h-px bg-gray-400" />
          <span className="px-2 text-sm text-gray-500 whitespace-nowrap">
            간편 로그인
          </span>
          <div className="flex-grow h-px bg-gray-400" />
        </div>
        <GoogleLoginButton />
        <KakaoLoginButton />
      </div>
    </div>
  );
};
