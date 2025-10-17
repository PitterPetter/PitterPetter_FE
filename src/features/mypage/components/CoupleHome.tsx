import { useState, useEffect, useRef, useCallback } from 'react';
import { useMypageStore } from "../../../shared/store/mypage.store";
import { CoupleInfoStore } from "../../../shared/store/type";
import { mypageApi } from "../api";
import { differenceInDays, format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../shared/ui/spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faHeart, faCalendarCheck, faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import clsx from "clsx";

export const CoupleHome = () => {
  const navigate = useNavigate();
  const { coupleHomeName, partnerName, partnerEmail, datingStartDate, setCoupleHomeName } = useMypageStore() as CoupleInfoStore;
  const { isProfileLoading, isProfileError } = useMypageStore();
  const [editCoupleHomeName, setEditCoupleHomeName] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const originalCoupleHomeName = useRef<string>('');

  // 함께한 날 계산
  const daysCount = datingStartDate 
    ? differenceInDays(new Date(), new Date(datingStartDate)) + 1
    : 0;
  
  // 커플 홈 이름 업데이트 mutation
  const updateCoupleHomeMutation = useMutation({
    mutationFn: (data: { coupleHomeName: string; datingStartDate: string }) => 
      mypageApi.putCoupleHome(data),
    onSuccess: () => {
      toast.success('커플 홈 이름이 저장되었습니다');
    },
    onError: () => {
      toast.error('저장에 실패했습니다');
    },
  });

  // 커플 헤어지기 mutation
  const deleteCoupleMutation = useMutation({
    mutationFn: mypageApi.deleteCouple,
    onSuccess: () => {
      navigate('/home/coupleroom');
    },
  });

  // 커플 정보 저장
  const handleSaveCoupleHome = useCallback(() => {
    // 변경사항이 없으면 API 호출 안함
    if (coupleHomeName === originalCoupleHomeName.current) {
      return;
    }
    
    updateCoupleHomeMutation.mutate({
      coupleHomeName,
      datingStartDate,
    });
  }, [coupleHomeName, datingStartDate]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setEditCoupleHomeName(false);
        handleSaveCoupleHome();
      }
    };

    if (editCoupleHomeName) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editCoupleHomeName, handleSaveCoupleHome]);

  // 날짜 포멧 변경
  const formatDate = (date: string) => {
    if (!date) return '-';
    return format(new Date(date), 'yyyy.MM.dd');
  };
  
  const handleBreakUp = () => {
    const answer = window.confirm(`${partnerName}님과 함께한 기록들이 전부 삭제됩니다.\n 정말로 헤어지시겠습니까?`);
    if (answer) {
      deleteCoupleMutation.mutate();
    }
  };
  const statCardClasses = "flex flex-col gap-1 rounded-2xl border border-white/50 bg-white/70 px-4 py-5 text-center shadow-sm backdrop-blur transition hover:shadow-md";
  const StatCard = ({
    icon,
    label,
    value,
    highlight,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
  }) => (
    <div
      className={clsx(
        statCardClasses,
        highlight && "bg-gradient-to-br from-primary/20 via-white to-transparent border-primary/20"
      )}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">커플 홈</h1>
        <button
          onClick={handleBreakUp}
          className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-100"
        >
          헤어지기
        </button>
      </div>

      {isProfileLoading && <Spinner />}
      {isProfileError && (
        <div className="flex h-24 items-center justify-center rounded-xl bg-red-50 text-red-500">
          정보를 불러오는데 실패했습니다.
        </div>
      )}
      {!isProfileLoading && !isProfileError && (
        <>
          <div className="rounded-3xl border border-primary/10 bg-gradient-to-r from-primary/10 via-white to-transparent p-6 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium text-primary/80">우리 커플 닉네임</span>
              <div ref={inputRef} className="flex w-full items-center gap-3 rounded-2xl border border-primary/10 bg-white px-4 py-3 text-xl font-semibold text-gray-900 shadow-sm">
                {editCoupleHomeName ? (
                  <input 
                    type="text" 
                    value={coupleHomeName} 
                    onChange={(e) => setCoupleHomeName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditCoupleHomeName(false);
                        handleSaveCoupleHome();
                      }
                    }}
                    className="w-full bg-transparent text-lg font-semibold text-gray-900 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <>
                    <span>{coupleHomeName}</span>
                    <button
                      type="button"
                      className="ml-auto flex items-center gap-2 rounded-full border border-primary/20 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/10"
                      onClick={() => {
                        originalCoupleHomeName.current = coupleHomeName;
                        setEditCoupleHomeName(!editCoupleHomeName);
                      }}
                    >
                      <FontAwesomeIcon icon={faPencil} className="h-3 w-3" />
                      수정
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-primary/10 bg-white/80 p-6 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <FontAwesomeIcon icon={faHeart} className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">파트너</p>
                  <p className="text-lg font-semibold text-gray-900">{partnerName || '이름 미등록'}</p>
                  <p className="text-sm text-gray-500">{partnerEmail || '이메일 미등록'}</p>
                </div>
              </div>
              <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  icon={<FontAwesomeIcon icon={faCalendarCheck} className="h-4 w-4" />}
                  label="우리가 만난 날"
                  value={formatDate(datingStartDate)}
                  highlight
                />
                <StatCard
                  icon={<FontAwesomeIcon icon={faHeart} className="h-4 w-4" />}
                  label="함께한 일수"
                  value={`${daysCount}일`}
                />
                <StatCard
                  icon={<FontAwesomeIcon icon={faEnvelopeOpenText} className="h-4 w-4" />}
                  label="특별한 날"
                  value={formatDate(datingStartDate)}
                />
                <StatCard
                  icon={<FontAwesomeIcon icon={faHeart} className="h-4 w-4" />}
                  label="함께한 코스"
                  value="0"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
