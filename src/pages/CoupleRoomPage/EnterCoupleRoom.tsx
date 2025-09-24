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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (pastedData.length === 6) {
      const newCodes = pastedData.split('');
      setCodes(newCodes);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-64px)]">
      <div className="h-[700px] w-[700px] border-gray-300 border rounded-2xl p-4 pb-6 flex flex-col gap-4 justify-center items-center">
        <h1 className="text-xl font-bold py-4">커플 방 입장</h1>
        <p className="text-sm text-gray-600 mb-4">6자리 코드를 입력해주세요</p>
        <div className="flex gap-2 justify-center items-center">
          {codes.map((code, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              value={code}
              onChange={(e) => handleInputChange(index, e.target.value)}
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
        >
          입장하기
        </Button>
      </div>
    </div>
  );
};