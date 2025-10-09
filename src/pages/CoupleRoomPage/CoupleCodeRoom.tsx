import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCoupleRoomStore } from "../../shared/store/CoupleRoom.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { PhotoStack } from "../../features/auth/components/PhotoStack";

export const CoupleCodeRoom = () => {
  const navigate = useNavigate();
  const { coupleId } = useCoupleRoomStore();
  const [copied, setCopied] = useState(false);
  let id = '';
  if (!coupleId) {
    id = '123123';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coupleId ? coupleId : id);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2800);
    toast.success('복사되었습니다');
  };
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative h-[800px] w-[700px] bg-[#DED6D6] border-gray-300 border rounded-2xl p-4 py-16 flex flex-col gap-2 justify-start items-center">
        <PhotoStack />
        <h1 className="text-2xl font-bold py-4 pt-16">커플 코드 생성 완료</h1>
        <p className="pb-2">해당 코드를 연인에게 보내주세요</p>
        <div className="relative flex justify-center items-center bg-white rounded-md w-[320px] h-[48px] p-2">
          <p className=" font-mono text-2xl">{coupleId ? coupleId : id}</p>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="w-[16px] h-[16px] cursor-pointer text-gray-500" onClick={handleCopy} />
          </div>
        </div>
        <FontAwesomeIcon icon={faChevronLeft} className="absolute w-[18px] h-[18px] top-6 left-5 cursor-pointer" onClick={() => navigate('/home/coupleroom')} />
      </div>
    </div>
  );
};