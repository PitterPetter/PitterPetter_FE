import { Button } from "@mui/material";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useCoupleRoomStore } from "../../shared/store/CoupleRoom.store";
import { CoupleRoomStore } from "../../shared/store/type";
import { coupleRoomApi } from "../../features/coupleroom/api";
import { PostCoupleRoom } from "../../features/coupleroom/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-toastify';

export const CreateCoupleRoom = () => {
  const navigate = useNavigate();
  const [coupleName, setCoupleName] = useState('');
  const [coupleDate, setCoupleDate] = useState(new Date());
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
    try {
      console.log('body data: ', {coupleHomeName: coupleName, datingStartDate: formatDate(coupleDate)});
      const res = await createCoupleRoom({
        coupleHomeName: coupleName,
        datingStartDate: formatDate(coupleDate),
      });
      console.log('res:', res);
      
      if (res.status === 'success') {
        useCoupleRoomStore.setState({
          coupleId: res.data.inviteId,
          coupleName: coupleName,
          coupleDate: formatDate(coupleDate),
          coupleCode: res.data.inviteCode,
        });
        toast.success('커플 정보 생성에 성공했습니다');
        navigate(`/home/coupleroom/create/${res.data.inviteCode}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('커플 정보 생성에 실패했습니다');
      throw error;
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative h-[800px] w-[700px] bg-[#DED6D6] border-gray-300 border rounded-2xl p-4 pb-6 flex flex-col gap-4 justify-center items-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          <h1 className="text-2xl py-4"><span className="text-pink-900">커플 정보</span> 설정</h1>
          <p className="text-sm font-bold">커플 정보를 설정해주세요</p>
          <div className="flex flex-col gap-2 justify-center items-center">
            <p className="text-sm font-bold">커플 이름</p>
            <input id="filled-basic" placeholder="입력해주세요" className="bg-white rounded-md w-[320px] h-[48px] p-2" value={coupleName} onChange={(e) => setCoupleName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center pb-20">
            <p className="text-sm font-bold">교제 시작일</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={coupleDate}
                onChange={(date) => setCoupleDate(date as Date)}
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
                        borderRadius: "8px",
                        width: "320px",
                        height: "48px",
                        padding: "12px",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <Button 
            variant="contained" 
            className="mt-4"
            disabled={coupleName === '' || coupleDate === null}
            onClick={() => {
              handleSave();
            }}
            sx={{
              backgroundColor: '#662B2B',
              width: '220px',
              height: '44px',
              textCenter: 'center',
              py: '2px',
              rounded: 'md',
              cursor: 'pointer',
              text: 'white',
            }}
          >
            {isPending ? '생성중...' : '입장하기'}
          </Button>
        </div>
        <FontAwesomeIcon icon={faChevronLeft} className="absolute w-[18px] h-[18px] top-6 left-5 cursor-pointer" onClick={() => navigate('/home/coupleroom')} />
      </div>
    </div>
  );
};