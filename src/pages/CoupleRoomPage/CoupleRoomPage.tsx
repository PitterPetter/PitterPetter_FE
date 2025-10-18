import { useNavigate } from "react-router-dom";

const CoupleRoomHero = () => {
  const journey = [
    { step: "01", title: "우리 기록장", description: "데이트 다이어리를 작성하고 서로의 감정을 공유해요" },
    { step: "02", title: "취향 캡처", description: "맛집, 분위기, 활동 취향을 정리해 맞춤 추천을 받아요" },
    { step: "03", title: "코스 추천", description: "Loventure가 두 사람의 취향에 맞는 데이트 코스를 제안해요" },
  ];

  const sideCards = [
    { title: "데이트 캘린더", caption: "다가오는 일정과 기념일을 함께 확인해요" },
    { title: "공유 앨범", caption: "사진과 순간들을 한곳에 모아 둘 수 있어요" },
  ];

  return (
    <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-6">

      <div className="relative flex w-full max-w-[420px] flex-col gap-5 rounded-3xl border border-white/50 bg-white/80 p-7 shadow-[0_26px_60px_rgba(102,43,43,0.18)] backdrop-blur-lg">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-[26px]">
            둘만의 여정을 이어가는 커플룸
          </h2>
          <p className="text-sm text-gray-600">
            데이트를 계획하고 추억을 아카이빙하며 서로의 감정을 나누는 공간이에요. 한 곳에서 모든 여정을 관리해 보세요.
          </p>
        </div>

        <div className="relative border border-primary/20 bg-white/90 p-5 shadow-[0_18px_40px_rgba(102,43,43,0.1)]">
          <div className="absolute -top-6 right-6 h-12 w-12 rounded-full bg-gradient-to-br from-primary/30 via-rose-100/70 to-transparent blur-xl" />
          <div className="flex flex-col gap-4">
            {journey.map(({ step, title, description }) => (
              <div key={title} className="flex items-start gap-3 hover:translate-x-1 transition">
                <span className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                  {step}
                </span>
                <div className="flex flex-col gap-[2px] text-left">
                  <span className="text-sm font-semibold text-gray-900">{title}</span>
                  <span className="text-xs text-gray-500">{description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CoupleRoomPage = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-[80px] sm:pt-0 relative w-full rounded-none bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:rounded-4xl sm:h-[500px] sm:w-[1000px] md:rounded-xl">
      <div className="relative grid gap-10 px-6 py-10 sm:px-12 sm:py-0 md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center gap-6 text-center md:text-left">
          <div className="flex flex-col gap-3">
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
              onClick={() => navigate("/home/coupleroom/create")}
            >
              커플 방 생성
            </button>
            <button
              type="button"
              className="w-full rounded-full border border-primary/40 bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-white sm:w-auto"
              onClick={() => navigate("/home/coupleroom/enter")}
            >
              커플 방 입장
            </button>
          </div>
          <p className="text-xs text-gray-500">
            이미 커플룸을 만들었다면 초대 코드를 입력해 바로 연결할 수 있어요.
          </p>
        </div>
        <div className="relative flex items-center justify-center">
          <CoupleRoomHero />
        </div>
      </div>
    </div>
  );
};
