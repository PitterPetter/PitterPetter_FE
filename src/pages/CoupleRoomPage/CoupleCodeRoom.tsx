import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCoupleRoomStore } from "../../shared/store/CoupleRoom.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";

export const CoupleCodeRoom = () => {
  const navigate = useNavigate();
  const { coupleCode } = useCoupleRoomStore();
  const [copied, setCopied] = useState(false);
  let id = '';
  if (!coupleCode) {
    id = '000000';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coupleCode ? coupleCode : id);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2800);
    toast.success('복사되었습니다');
  };
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_#fde2e4_0%,_transparent_35%),radial-gradient(circle_at_bottom,_#ffe0f0_0%,_transparent_35%)] opacity-80" />
      <div className="relative w-full max-w-5xl overflow-hidden rounded-none bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:rounded-4xl sm:max-h-[calc(100vh-80px)] md:rounded-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-rose-50/80 to-primary/20 opacity-80" />
        <button
          type="button"
          className="absolute left-6 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-600 hover:shadow-md transition duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-white"
          onClick={() => navigate('/coupleroom')}
          aria-label="뒤로 가기"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
        </button>

        <div className="relative flex flex-col gap-10 px-6 py-14 text-center sm:px-10 sm:py-16 md:px-14">
          <header className="mx-auto flex w-full max-w-xl flex-col gap-4">
            <div className="inline-flex items-center justify-center gap-3 self-center rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <FontAwesomeIcon icon={faEnvelopeOpenText} className="h-4 w-4" />
              초대 코드가 준비됐어요
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
              두 사람만의 Loventure 공간에 초대하세요
            </h1>
          </header>

          <section className="relative flex flex-col items-center gap-6">
            <div className="relative flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-primary/20 bg-white/90 px-8 py-10 text-center shadow-[0_22px_50px_rgba(102,43,43,0.15)]">
              <div className="pointer-events-none absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/30 via-rose-200/40 to-transparent blur-3xl" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">Invite Code</p>
              <div className="flex items-center justify-center rounded-2xl border border-primary/10 bg-white px-6 py-4 shadow-[0_16px_40px_rgba(102,43,43,0.12)]">
                <span className="text-3xl font-semibold tracking-[0.4em] text-gray-900 sm:text-4xl">
                  {coupleCode ? coupleCode : id}
                </span>
              </div>
              <div
                onClick={handleCopy}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-white"
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="h-4 w-4" />
                {copied ? "복사 완료!" : "코드 복사하기"}
              </div>
            </div>
          </section>

          <footer className="mx-auto grid w-full max-w-2xl gap-4 text-left sm:grid-cols-1 sm:gap-6">
            <div className="flex items-center justify-center p-5">
              
            <p className="text-sm text-gray-600 sm:text-base">
              아래 코드를 연인에게 공유하면 같은 커플룸에서 다이어리, 추천 코스를 함께 즐길 수 있어요.
            </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
