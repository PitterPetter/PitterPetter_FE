import { Button } from "@mui/material";
import kakaoIcon from "../assets/kakaoLogo.png";


export const KakaoLoginButton = () => {
  return (
    <div>
      <Button
      variant="outlined"
      sx={{
        borderRadius: '20px',
        width: '240px',
        height: '40px',
        textAlign: 'center',
        textTransform: 'none',
        fontSize: '14px',
        color: 'rgb(55, 53, 47)',
      }}
      onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`}
    >
        <img src={kakaoIcon} alt="kakao" className="w-6 h-6 mr-2" />
        kakaotalk으로 로그인
      </Button>
    </div>
  )
}