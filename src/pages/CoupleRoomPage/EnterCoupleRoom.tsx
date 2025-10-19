import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { coupleRoomApi } from "../../features/coupleroom/api";
import { authApi } from "../../features/auth/api";
import { useAuthStore } from "../../shared/store/auth.store";
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { redirectBasedOnStatus } from "../../shared/utils/authRedirect";

export const EnterCoupleRoom = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setPermissionLevel } = useAuthStore();
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const [isError, setIsError] = useState(false);

  const { mutateAsync: validateCoupleCode, isPending } = useMutation({
    mutationFn: async (inviteCode: string) => {
      try {
        console.log("inviteCode: ", inviteCode);
        const res = await coupleRoomApi.validateCoupleCode(inviteCode);
        if (res.data.status === 'error') {
          throw new Error('커플 인증에 실패했습니다');
        }
        return res.data;
      } catch (error) {
        setIsError(true);
        throw error;
      }
    },
  });

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // 한 글자만 입력 가능
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);
    
    // 자동으로 다음 input으로 이동
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus(); 
    }
  };

  // 백스페이스 누르면 이전 input으로 이동
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && codes[index] === '' && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (pastedData.length === 6) {
      const newCodes = pastedData.split('');
      setCodes(newCodes);
      const lastInput = document.getElementById(`code-input-5`);
      lastInput?.focus();
    }
  };

  const handleEnter = async () => {
    const enteredCode = codes.join('');
    console.log('입력된 코드:', enteredCode);
    
    try {
      setIsError(false);
      const result = await validateCoupleCode(enteredCode);
      console.log('result', result);

      if (result.status === 'success') {
        toast.success('커플 인증이 완료되었습니다');
        
        // 인증 상태 캐시 무효화
        queryClient.invalidateQueries({ queryKey: ['authStatus'] });
        
        // 커플 매칭 완료 후 상태를 GET으로 확인
        try {
          const statusResponse = await authApi.getStatus();
          const userStatus = statusResponse.data.status;
          console.log("[EnterCoupleRoom] User status after couple matching:", userStatus);
          
          // auth store 업데이트
          setPermissionLevel(userStatus as "ONBOARDING_REQUIRED" | "COUPLE_MATCHING_REQUIRED" | "ROCK_REQUIRED" | "COMPLETED");
          
          // 상태에 따라 적절한 페이지로 리다이렉트
          redirectBasedOnStatus(userStatus, navigate);
        } catch (error) {
          console.error("[EnterCoupleRoom] Failed to get user status:", error);
          // 상태 확인 실패 시 기본값으로 리다이렉트
          navigate('/district/choose');
        }
      } else {
        setIsError(true);
        throw new Error('커플 인증에 실패했습니다');
      }
    } catch (error) {
      console.error(error);
      toast.error('커플 인증에 실패했습니다');
      setIsError(true);
      throw error;
    }
  };

  const isDisabled = codes.some(code => code === '') || isPending;

  return (
    <div className="pt-[80px] sm:pt-[20px] relative w-full overflow-hidden h-full sm:h-auto rounded-none bg-gradient-to-r from-rose-100/90 via-rose-100/90 to-white/70 shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:rounded-4xl sm:min-h-[500px] sm:max-w-[1000px] md:rounded-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#fde2e4_0%,_transparent_45%),radial-gradient(circle_at_bottom,_#ffe0f0_0%,_transparent_40%)] opacity-70" />
      <button
        type="button"
        className="absolute left-6 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-600 hover:shadow-md transition duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-white"
        onClick={() => navigate('/coupleroom')}
        aria-label="뒤로 가기"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
      </button>
      <div className="relative flex flex-col gap-8 px-6 py-12 text-center sm:px-10 sm:py-14 sm:text-left">
        <header className="flex flex-col gap-4">
          <span className="inline-flex self-center items-center rounded-full  px-4 py-1 text-xs font-semibold text-primary sm:self-start">
            
          </span>
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
              코드를 입력하고 커플 인증을 완료하세요
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">
              연인의 화면에 표시된 6자리 초대 코드를 입력하면, 두 분의 커플룸이 연결돼요.
            </p>
          </div>
        </header>

        <section className="flex flex-col items-center gap-6 sm:items-start">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-gray-700">초대 코드</span>
            <div className="grid grid-cols-6 gap-3 sm:gap-4">
              {codes.map((code, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  value={code}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="flex h-16 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white text-center text-2xl font-semibold tracking-wider text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:h-20 sm:w-14"
                  maxLength={1}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            코드는 한 번만 입력하면 돼요. 인증 이후에는 Loventure가 두 분의 취향을 연결해 드릴게요.
          </p>
          {isError && <p className="text-sm font-medium text-red-500">커플 인증에 실패했습니다. 코드를 다시 확인해주세요.</p>}
        </section>

        <footer className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-gray-500">초대 코드를 받지 못했다면, 상대방에게 커플룸 생성 후 공유를 요청해 주세요.</p>
          <button
            type="button"
            disabled={isDisabled}
            onClick={handleEnter}
            className={`w-full max-w-[220px] rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white sm:w-auto ${
              isDisabled
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-primary text-white shadow-lg hover:bg-primary/80 focus:ring-primary/40"
            }`}
          >
            {isPending ? '입장하는 중...' : '커플룸 입장하기'}
          </button>
        </footer>
      </div>
    </div>
  );
};
