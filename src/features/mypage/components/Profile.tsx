import { useState } from "react";
import { mypageApi } from "../api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../../../shared/ui/spinner";
import { useMypageStore } from "../../../shared/store/mypage.store";

export const Profile = () => {
  const { isProfileLoading, setIsProfileLoading, isProfileError, setIsProfileError } = useMypageStore();
  const { data: mypage } = useQuery({
    queryKey: ['mypage'],
    queryFn: async () => {
      try {
        setIsProfileLoading(true);
        const response = await mypageApi.getMypage();
        setIsProfileError(false);
        return response.data.user;
      } catch (error) {
        console.error("mypage 불러오기 실패:", error);
        setIsProfileError(true);
        throw error;
      } finally {
        setIsProfileLoading(false);
      }
    },
  });
  const [nickname, setNickname] = useState(mypage?.nickname);
  return (
    <div className="flex flex-col gap-4 p-0 pt-0">
      {/* 프로필 정보 */}
      <div className="pb-4">
        <h1 className="text-2xl pb-4">프로필 정보</h1>

        {isProfileLoading && <Spinner />}
        {isProfileError && <div className="flex justify-center items-center text-red-500">정보를 불러오는데 실패했습니다.</div>}
        {mypage && (
        <div className="grid grid-cols-2 grid-rows-2 gap-4 px-4">
          <div className="h-full flex flex-col gap-2">
            <h2 className="text-sm font-bold">이름</h2>
            <div className="w-full h-[42px] rounded-md p-3 bg-gray-100 cursor-not-allowed border border-gray-300 text-gray-700">
              {mypage?.name}
            </div>
          </div>
          <div className="h-full flex flex-col gap-2">
            <h2 className="text-sm font-bold">닉네임</h2>
            <input 
              type="text" 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-[42px] rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent"
              placeholder="닉네임을 입력하세요"
            />
          </div>
          <div className="h-full flex flex-col gap-2">
            <h2 className="text-sm font-bold">이메일</h2>
            <div className="w-full h-[42px] rounded-md p-3 bg-gray-100 cursor-not-allowed border border-gray-300 text-gray-700">
              {mypage?.email}
            </div>
          </div>
          <div className="h-full flex flex-col gap-2">
            <h2 className="text-sm font-bold">생년월일</h2>
            <div className="w-full h-[42px] rounded-md p-3 bg-gray-100 cursor-not-allowed border border-gray-300 text-gray-700">
              {mypage?.birthdate}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};