import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";


export const GoogleLoginButton = () => {
  return (
    <div className="flex items-center justify-center">
    {/* 백엔드 구글 서버로 리다이랙트 */}
    <Button variant="outlined" className="w-[160px] text-sm text-gray-500" onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`}>
      <FontAwesomeIcon icon={faGoogle as any} className="mr-2 text-blue-500" />
      구글로 로그인
    </Button>
    </div>
  )
}
