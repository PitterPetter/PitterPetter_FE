import { Button } from "@mui/material";
import googleIcon from "../assets/googleLogo.png";


export const GoogleLoginButton = () => {
  return (
    <div className="flex items-center justify-center">
    {/* 백엔드 구글 서버로 리다이랙트 */}
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
      onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`}
    >
      <img src={googleIcon} alt="google" className="w-6 h-6 mr-2" />
      Google로 로그인
    </Button>
    </div>
  )
}
