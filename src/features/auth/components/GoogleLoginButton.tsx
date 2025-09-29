import { Button } from "@mui/material";


export const GoogleLoginButton = () => {
  return (
    <div>
    {/* 백엔드 구글 서버로 리다이랙트 */}
    <Button variant="contained" className="text-sm text-gray-500" onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`}>구글로 로그인</Button>
    </div>
  )
}
