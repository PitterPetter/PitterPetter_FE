import { useState } from "react";
import { Button } from "@mui/material";

export const CoupleHome = () => {
  return (
    <div className="flex flex-col p-4 pt-0">
      <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6">
        <h1 className="text-xl font-bold py-4">커플 홈</h1>
        <div className="flex flex-col gap-2">
          <div className="flex justify-center items-center w-full font-bold">
            커플명
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2">
              <div className="bg-gray-200 w-[65px] h-[65px] rounded-full"></div>
              <div className="flex flex-col gap-2 justify-center">
                <p>박준호</p>
                <p>@junho_park</p>
              </div>
            </div>
            <div>
              <Button variant="contained">커플 연결 끊기</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-4 px-4 pt-8">
            <div className="h-full flex flex-col gap-2 justify-center items-center">
              <h2 className="text-sm font-bold">2025.09.16</h2>
              <p>사귄 날</p>
            </div>
            <div className="h-full flex flex-col gap-2 justify-center items-center">
              <h2 className="text-sm font-bold">378</h2>
              <p>함께한 날</p>
            </div>
            <div className="h-full flex flex-col gap-2 justify-center items-center">
              <h2 className="text-sm font-bold">2025.09.16</h2>
              <p>특별한 날</p>
            </div>
            <div className="h-full flex flex-col gap-2 justify-center items-center">
              <h2 className="text-sm font-bold">47</h2>
              <p>함께한 코스</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-12 pr-4">
          <Button variant="contained">저장</Button>
        </div>
      </div>
    </div>
  );
};