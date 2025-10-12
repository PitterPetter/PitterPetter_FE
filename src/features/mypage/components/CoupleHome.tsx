import { useMypageStore } from "../../../shared/store/mypage.store";
import { CoupleInfoStore } from "../../../shared/store/type";
import { mypageApi } from "../api";
import { differenceInDays, format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../shared/ui/spinner";

export const CoupleHome = () => {
  const navigate = useNavigate();
  const { coupleHomeName, partnerName, partnerEmail, coupleId, datingStartDate } = useMypageStore() as CoupleInfoStore;
  const { isProfileLoading, isProfileError } = useMypageStore();

  // 함께한 날 계산
  const daysCount = datingStartDate 
    ? differenceInDays(new Date(), new Date(datingStartDate)) + 1
    : 0;
  const mutation = useMutation({
    mutationFn: mypageApi.deleteCouple,
    onSuccess: () => {
      navigate('/home/coupleroom');
    },
  });

  // 날짜 포멧 변경
  const formatDate = (date: string) => {
    if (!date) return '-';
    return format(new Date(date), 'yyyy.MM.dd');
  };
  
  const handleBreakUp = () => {
    const answer = window.confirm(`${partnerName}님과 함께한 기록들이 전부 삭제됩니다.\n 정말로 헤어지시겠습니까?`);
    if (answer) {
      console.log('coupleId:', coupleId);
      mutation.mutate(coupleId);
    }
  };
  return (
    <div className="h-full w-full p-8 py-2">
      <h1 className="text-2xl py-0 mb-4">커플 홈</h1>
      {isProfileLoading && <Spinner />}
      {isProfileError && <div className="flex justify-center items-center text-red-500">정보를 불러오는데 실패했습니다.</div>}
      {!isProfileLoading && !isProfileError && (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex justify-center items-center w-full text-xl">
              {coupleHomeName}
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-2">
                <div className="bg-gray-200 w-[65px] h-[65px] rounded-full"></div>
                <div className="flex flex-col gap-2 justify-center">
                  <p>{partnerName}</p>
                  <p>{partnerEmail}</p>
                </div>
              </div>
              <div>
                <div className="text-black w-[120px] h-[40px] text-center py-2 rounded-md cursor-pointer border border-primary/10 text-gray-500 mt-4 hover:bg-third/20 transition-all duration-300"
                  onClick={handleBreakUp}
                >헤어지기</div>
              </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-2 pt-4">
              <div className="h-full flex flex-col gap-2 justify-center items-center bg-primary/10 p-2">
                <h2 className="text-xl">{formatDate(datingStartDate)}</h2>
                <p className="text-gray-500 text-sm">우리가 사귀기 시작한 날</p>
              </div>
              <div className="h-full flex flex-col gap-2 justify-center items-center bg-primary/10 p-2">
                <h2 className="text-xl">{daysCount}일</h2>
                <p className="text-gray-500 text-sm">함께한 날</p>
              </div>
              <div className="h-full flex flex-col gap-2 justify-center items-center bg-primary/10 p-2">
                <h2 className="text-xl">{formatDate(datingStartDate)}</h2>
                <p className="text-gray-500 text-sm">특별한 날</p>
              </div>
              <div className="h-full flex flex-col gap-2 justify-center items-center bg-primary/10 p-2">
                <h2 className="text-xl">0</h2>
                <p className="text-gray-500 text-sm">함께한 코스</p>
              </div>
            </div>
          </div>
          {/* <div className="flex justify-end mt-12">
            <div className="bg-third/60 text-white w-[120px] h-[40px] text-center py-2 rounded-md cursor-pointer border border-primary/10 text-gray-500 mt-4 hover:bg-third/80 transition-all duration-300">저장</div>
          </div> */}
        </>
      )}
    </div>
  );
};