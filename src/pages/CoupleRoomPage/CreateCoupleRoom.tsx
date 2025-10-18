import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useCoupleRoomStore } from "../../shared/store/CoupleRoom.store";
import { coupleRoomApi } from "../../features/coupleroom/api";
import { PostCoupleRoom } from "../../features/coupleroom/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-toastify';

export const CreateCoupleRoom = () => {
  const navigate = useNavigate();
  const [coupleName, setCoupleName] = useState("");
  const [coupleDate, setCoupleDate] = useState<Date | null>(new Date());
  const { mutateAsync: createCoupleRoom, isPending } = useMutation({
    mutationFn: async (coupleRoom: PostCoupleRoom) => {
      const res = await coupleRoomApi.createCoupleRoom(coupleRoom);
      return res.data;
    },
  });

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    if (!coupleDate || coupleName.trim() === "") return;

    try {
      const formattedDate = formatDate(coupleDate);
      console.log("body data: ", { coupleHomeName: coupleName, datingStartDate: formattedDate });
      const res = await createCoupleRoom({
        coupleHomeName: coupleName,
        datingStartDate: formattedDate,
      });
      console.log("res:", res);

      if (res.status === "success") {
        useCoupleRoomStore.setState({
          coupleCode: res.data.inviteCode,
          coupleName: coupleName,
          coupleDate: formattedDate,
        });
        toast.success("커플 정보 생성에 성공했습니다");
        navigate(`/home/coupleroom/create/${res.data.inviteCode}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("커플 정보 생성에 실패했습니다");
      throw error;
    }
  };

  const isDisabled = coupleName.trim() === "" || coupleDate === null || isPending;

  return (
    <div className="pt-[80px] sm:pt-[40px] relative w-full h-full sm:h-auto overflow-hidden rounded-none bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:rounded-4xl sm:h-[500px] sm:max-w-[1000px] md:rounded-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#fde2e4_0%,_transparent_45%),radial-gradient(circle_at_bottom,_#ffe0f0_0%,_transparent_40%)] opacity-70" />
      <button
        type="button"
        className="absolute left-6 top-24 sm:top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-600 hover:shadow-md transition duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-white"
        onClick={() => navigate("/home/coupleroom")}
        aria-label="뒤로 가기"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
      </button>
      <div className="relative flex flex-col gap-8 px-6 py-12 sm:px-10 sm:py-14">
        <header className="flex flex-col gap-4 text-center sm:text-left">
          <span className="inline-flex items-center self-center rounded-full px-4 py-1 text-xs font-semibold text-primary sm:self-start">
            
          </span>
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
              커플 정보를 설정하고 Loventure를 시작하세요
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">
              커플 이름과 교제 시작일을 설정하면, 두 분만의 초대 코드가 생성돼요.
              초대 코드를 공유해 커플룸을 함께 사용해 보세요.
            </p>
          </div>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="couple-name" className="text-sm font-semibold text-gray-700">
              커플 이름
            </label>
            <input
              id="couple-name"
              placeholder="커플 이름을 입력해주세요"
              className="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={coupleName}
              onChange={(e) => setCoupleName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-700">교제 시작일</span>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={coupleDate}
                onChange={(date) => setCoupleDate(date)}
                enableAccessibleFieldDOMStructure={false}
                slots={{
                  textField: TextField,
                }}
                slotProps={{
                  textField: {
                    variant: "standard",
                    sx: {
                      "& .MuiInput-underline:before": {
                        borderBottom: "none",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottom: "none",
                      },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "none",
                      },
                      "& .MuiInputBase-root": {
                        backgroundColor: "white",
                        borderRadius: "12px",
                        width: "100%",
                        height: "48px",
                        padding: "12px 16px",
                        boxShadow: "0 8px 24px rgba(102, 43, 43, 0.08)",
                        fontSize: "0.95rem",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </section>

        <footer className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-gray-500">초대 코드는 입력 후에도 마이페이지에서 다시 확인할 수 있어요.</p>
          <button
            type="button"
            disabled={isDisabled}
            onClick={handleSave}
            className={`w-full max-w-[220px] rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white sm:w-auto ${
              isDisabled
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-primary text-white shadow-lg hover:bg-primary/80 focus:ring-primary/40"
            }`}
          >
            {isPending ? "생성 중..." : "초대 코드 받기"}
          </button>
        </footer>
      </div>
    </div>
  );
};
