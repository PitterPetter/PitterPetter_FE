import { useNavigate } from "react-router-dom";

export const CoupleRoomPage = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-[80px] sm:pt-0 relative w-full rounded-none bg-gradient-to-r from-rose-100/90 via-rose-100/90 to-white/70 shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:rounded-4xl sm:h-[500px] sm:w-[1000px] md:rounded-xl">
      <div className="relative h-full grid gap-10 px-6 py-10 sm:px-12 sm:py-0 md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center gap-6 text-center md:text-left">
          <div className="flex flex-col gap-3">
            <span className="mx-auto inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
              Step 2 · 커플 연동
            </span>
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl md:text-4xl">
              안녕하세요,
              <br className="hidden sm:block" />
              퍼스널 데이트 매니저 Loventure입니다
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">
              커플룸을 생성하거나 초대 코드를 입력해 Loventure의 맞춤 추천을 바로 경험해 보세요.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
            <button
              type="button"
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-white sm:w-auto"
              onClick={() => navigate("/coupleroom/create")}
            >
              커플 방 생성
            </button>
            <button
              type="button"
              className="w-full rounded-full border border-primary/40 bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-white sm:w-auto"
              onClick={() => navigate("/coupleroom/enter")}
            >
              커플 방 입장
            </button>
          </div>
          <p className="text-xs text-gray-500">
            이미 커플룸을 만들었다면 초대 코드를 입력해 바로 연결할 수 있어요.
          </p>
        </div>
      </div>
    </div>
  );
};
