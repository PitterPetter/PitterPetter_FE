import { useState } from "react";

export const Profile = () => {
  const [name, setName] = useState('민지');
  return (
      <div className="flex flex-col gap-4 p-0 pt-0">
        {/* 프로필 정보 */}
        <div className="pb-4">
          <h1 className="text-2xl pb-4">프로필 정보</h1>
          <div className="grid grid-cols-2 grid-rows-2 gap-4 px-4">
            <div className="h-full flex flex-col gap-2">
              <h2 className="text-sm font-bold">이름</h2>
              <div className="w-full h-[42px] rounded-md p-3 bg-gray-100 cursor-not-allowed border border-gray-300 text-gray-700">
                김민지
              </div>
            </div>
            <div className="h-full flex flex-col gap-2">
              <h2 className="text-sm font-bold">닉네임</h2>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[42px] rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent"
                placeholder="닉네임을 입력하세요"
              />
            </div>
            <div className="h-full flex flex-col gap-2">
              <h2 className="text-sm font-bold">이메일</h2>
              <div className="w-full h-[42px] rounded-md p-3 bg-gray-100 cursor-not-allowed border border-gray-300 text-gray-700">
                김민지@gmail.com
              </div>
            </div>
            <div className="h-full flex flex-col gap-2">
              <h2 className="text-sm font-bold">생년월일</h2>
              <div className="w-full h-[42px] rounded-md p-3 bg-gray-100 cursor-not-allowed border border-gray-300 text-gray-700">
                2000.01.01
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};