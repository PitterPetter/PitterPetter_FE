import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const EnterCoupleRoom = () => {
  const navigate = useNavigate();
  const [codes, setCodes] = useState(['', '', '', '', '', '']);

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
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="h-[700px] w-[700px] bg-[#DED6D6] border-gray-300 border rounded-2xl p-4 py-16 flex flex-col gap-2 justify-center items-center">
        <h1 className="text-2xl">코드를 입력하고 <span className="bg-pink-200 py-1">커플인증</span>하기</h1>
        <p>서비스를 이용하기 위해 커플 인증이 필요해요</p>
        <p className="text-sm text-gray-600 mt-8">연인의 화면에 표시된 6자리 코드를 입력해 주세요</p>
        <div className="flex gap-2 justify-center items-center mb-20">
          {codes.map((code, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              value={code}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="border border-gray-400 w-[50px] h-[70px] rounded-xl text-center text-xl font-mono focus:border-blue-500 focus:outline-none"
              maxLength={1}
            />
          ))}
        </div>
        
        <Button 
          variant="contained" 
          className="mt-4"
          disabled={codes.some(code => code === '')}
          onClick={() => {
            const enteredCode = codes.join('');
            console.log('입력된 코드:', enteredCode);
            // 코드 검증 로직 추가 예정
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
          입장하기
        </Button>
      </div>
    </div>
  );
};