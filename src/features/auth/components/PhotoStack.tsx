import ddp from "../assets/ddp.jpg";
import kyungbock from "../assets/kyungbock.jpg";
import lotteTower from "../assets/lotteTower.jpg";
import lotteWorld from "../assets/lotteWorld.png";
import shineIcon from "../../../shared/ui/assets/shineIcon.png";
import pageIcon from "../../../shared/ui/assets/pageIcon.png";
import bookIcon from "../../../shared/ui/assets/bookIcon.png";
import logo from "/logo.png";

export const PhotoStack = () => {
  const imageStyle = "w-[200px] h-[136px] lg:w-[250px] lg:h-[160px] flex p-[3px] bg-white transition-all duration-500 rounded-[24px]";
  const buttonStyle = "absolute bg-white/30 backdrop-blur-sm border border-white/20 shadow-xl flex items-center justify-center rounded-[80px] p-[3px] transition-all duration-500";

  return (
    <div className="relative flex flex-col justify-center items-center z-0 p-4 min-w-[450px] h-[300px] group
      lg:w-[800px] lg:h-[600px]
    ">
      <img src={logo} alt="logo" className="lg:w-14 lg:h-14 w-10 h-10" />
      {/* image */}
      <div className={`
        ${imageStyle}        
        absolute top-[0px] left-[130px] z-10 rotate-[1deg]
        group-hover:left-[40px] group-hover:top-[0px] group-hover:rotate-[-8deg]
        lg:group-hover:left-[180px] lg:group-hover:top-[50px] lg:group-hover:rotate-[-10deg]
        lg:left-[240px] lg:top-[70px]
      `}>
        <img src={kyungbock} alt="kyungbock" className="w-full h-full rounded-[20px]" />
      </div>
      <div className={`
        ${imageStyle}
        absolute top-[90px] right-[45px] z-20 rotate-[15deg] group-hover:rotate-[12deg]
        group-hover:right-[0px] group-hover:top-[40px] group-hover:rotate-[4deg]
        lg:group-hover:right-[100px] lg:group-hover:top-[180px] lg:group-hover:rotate-[10deg]
        lg:right-[240px] lg:top-[200px]
      `}>
        <img src={ddp} alt="ddp" className="w-full h-full rounded-[20px]" />
      </div>
      <div className={`
        ${imageStyle}
        absolute top-[100px] left-[50px] z-30 rotate-[-5deg]
        group-hover:left-[10px] group-hover:top-[150px] group-hover:rotate-[8deg]
        lg:group-hover:left-[100px] lg:group-hover:top-[250px] lg:group-hover:rotate-[8deg]
        lg:left-[150px] lg:top-[220px]
      `}>
        <img src={lotteTower} alt="lotteTower" className="w-full h-full rounded-[20px]" />
      </div>
      <div className={`
        ${imageStyle}
        absolute bottom-[0px] right-[50px] z-40 rotate-[4deg] group-hover:rotate-[1deg]
        group-hover:right-[40px] group-hover:bottom-[0px] group-hover:rotate-[-18deg]
        lg:group-hover:right-[180px] lg:group-hover:bottom-[70px] lg:group-hover:rotate-[-10deg]
        lg:right-[240px] lg:bottom-[120px]
      `}>
        <img src={lotteWorld} alt="lotteWorld" className="w-full h-full rounded-[20px]" />
      </div>
      {/* button */}
      <div className={`
        ${buttonStyle}
        absolute top-8 left-[15px] z-20 rotate-[15deg] group-hover:rotate-[12deg] w-[168px] h-[48px]
        group-hover:left-[0px] group-hover:top-[100px] group-hover:rotate-[1deg] 
        lg:group-hover:left-[30px] lg:group-hover:top-[170px] lg:group-hover:rotate-[1deg]
        lg:w-[200px] lg:h-[60px] lg:left-[70px] lg:top-[170px]
      `}>
        <div className="flex items-center justify-center bg-pink-100 w-full h-full rounded-[80px] gap-4">
          <img src={pageIcon} alt="book" className="w-[28px] h-[28px]" />
          추억로그
        </div>
      </div>
      <div className={`
        ${buttonStyle}
        absolute bottom-[20px] left-[60px] z-50 rotate-[-12deg] group-hover:rotate-[-12deg] w-[204px] h-[48px]
        group-hover:left-[80px] group-hover:bottom-[10px]
        lg:group-hover:left-[180px] lg:group-hover:bottom-[150px]
        lg:w-[250px] lg:h-[60px] lg:left-[170px] lg:bottom-[170px]
      `}>
        <div className="flex items-center justify-center bg-pink-100 w-full h-full rounded-[80px] gap-4">
          <img src={shineIcon} alt="shine" className="w-[28px] h-[28px]" />
          코스 추천 받기
        </div>
      </div>
      <div className={`
        ${buttonStyle}
        absolute bottom-[120px] right-[0px] z-30 rotate-[-2deg] group-hover:rotate-[1deg] w-[148px] h-[48px]
        group-hover:right-[0px] group-hover:bottom-[140px] group-hover:rotate-[15deg]
        lg:group-hover:right-[30px] lg:group-hover:bottom-[200px] lg:group-hover:rotate-[15deg]
        lg:w-[180px] lg:h-[60px] lg:right-[100px] lg:bottom-[260px]
      `}>
        <div className="flex items-center justify-center bg-pink-200 w-full h-full rounded-[80px] gap-4">
          <img src={bookIcon} alt="book" className="w-[28px] h-[28px]" />
          기록하기
        </div>
      </div>
    </div>
  )
}