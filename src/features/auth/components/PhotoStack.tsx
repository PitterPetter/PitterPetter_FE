import ddp from "../assets/ddp.jpg";
import kyungbock from "../assets/kyungbock.jpg";
import lotteTower from "../assets/lotteTower.jpg";
import lotteWorld from "../assets/lotteWorld.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faShieldBlank, faPalette } from "@fortawesome/free-solid-svg-icons";

export const PhotoStack = () => {
  const imageStyle = "flex p-[3px] bg-white hover:scale-105 transition-all duration-250 rounded-[24px]";
  const buttonStyle = "absolute bg-white/30 backdrop-blur-sm border border-white/20 shadow-xl flex items-center justify-center rounded-[80px] p-[3px] hover:scale-105 transition-all duration-250";

  return (
    <div className="relative flex flex-col justify-center items-center z-0 p-4 w-[340px] h-[300px]
      lg:w-[470px] lg:h-[360px]
    ">
      {/* image */}
      <div className={`
        ${imageStyle}        
        absolute top-0 left-15 z-10 rotate-[1deg] w-[200px] h-[136px]
        lg:w-[250px] lg:h-[166px] lg:left-15 lg:top-[-18px]
      `}>
        <img src={kyungbock} alt="kyungbock" className="w-full h-full rounded-[20px]" />
      </div>
      <div className={`
        ${imageStyle}
        absolute top-20 right-5 z-20 rotate-[15deg] hover:rotate-[12deg] w-[200px] h-[136px]
        lg:w-[250px] lg:h-[166px] lg:right-5 lg:top-24
      `}>
        <img src={ddp} alt="ddp" className="w-full h-full rounded-[20px]" />
      </div>
      <div className={`
        ${imageStyle}
        absolute top-20 left-3 z-30 rotate-[-5deg] hover:rotate-[-2deg] w-[200px] h-[136px]
        lg:w-[250px] lg:h-[166px] lg:left-8 lg:top-28
      `}>
        <img src={lotteTower} alt="lotteTower" className="w-full h-full rounded-[20px]" />
      </div>
      <div className={`
        ${imageStyle}
        absolute bottom-0 right-5 z-40 rotate-[4deg] hover:rotate-[1deg] w-[200px] h-[136px]
        lg:w-[250px] lg:h-[166px] lg:right-5 lg:bottom-[-12px]
      `}>
        <img src={lotteWorld} alt="lotteWorld" className="w-full h-full rounded-[20px]" />
      </div>
      {/* button */}
      <div className={`
        ${buttonStyle}
        absolute top-8 left-[-20px] z-20 rotate-[15deg] hover:rotate-[12deg] w-[168px] h-[48px]
        lg:w-[200px] lg:h-[60px] lg:left-[-50px] lg:top-16
      `}>
        <div className="flex items-center justify-center bg-pink-100 w-full h-full rounded-[80px] gap-4">
          <FontAwesomeIcon icon={faBookOpen} />
          추억로그
        </div>
      </div>
      <div className={`
        ${buttonStyle}
        absolute bottom-12 left-[12px] z-50 rotate-[-15deg] hover:rotate-[-12deg] w-[204px] h-[48px]
        lg:w-[250px] lg:h-[60px] lg:left-0 lg:bottom-8
      `}>
        <div className="flex items-center justify-center bg-pink-100 w-full h-full rounded-[80px] gap-4">
          <FontAwesomeIcon icon={faShieldBlank} />
          코스 추천 받기
        </div>
      </div>
      <div className={`
        ${buttonStyle}
        absolute bottom-30 right-[-40px] z-30 rotate-[-2deg] hover:rotate-[1deg] w-[148px] h-[48px]
        lg:w-[180px] lg:h-[60px] lg:right-[-80px] lg:bottom-32
      `}>
        <div className="flex items-center justify-center bg-pink-200 w-full h-full rounded-[80px] gap-4">
          <FontAwesomeIcon icon={faBookOpen} />
          기록하기
        </div>
      </div>
    </div>
  )
}