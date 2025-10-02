import { Button } from "@mui/material";


export const KakaoLoginButton = () => {
  return (
    <div>
      <Button variant="contained" className="w-[160px] text-sm text-gray-500" onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`}>
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11L6.866 21.83c-.418.442-.79.442-1.209 0-.419-.441-.419-.883 0-1.325l1.727-1.83c-2.88-1.768-4.884-4.542-4.884-7.49 0-4.521 4.701-8.185 10.5-8.185z"/>
        </svg>
        카카오로 로그인
      </Button>
    </div>
  )
}