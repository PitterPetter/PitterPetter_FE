export const CoupleHome = () => {
  return (
    <div className="h-full w-full p-8 py-2">
      <h1 className="text-2xl py-0 mb-4">커플 홈</h1>
      <div className="flex flex-col gap-2">
        <div className="flex justify-center items-center w-full text-xl">
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
            <div className="text-black w-[120px] h-[40px] text-center py-2 rounded-md cursor-pointer border border-primary/10 text-gray-500 mt-4 hover:bg-third/20 transition-all duration-300">헤어지기</div>
          </div>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-2 pt-4">
          <div className="h-full flex flex-col gap-2 justify-center items-center bg-primary/10 p-2">
            <h2 className="text-xl">2025.09.16</h2>
            <p className="text-gray-500 text-sm">우리가 사귀기 시작한 날</p>
          </div>
          <div className="h-full flex flex-col gap-2 justify-center items-center bg-primary/10 p-2">
            <h2 className="text-xl">378</h2>
            <p className="text-gray-500 text-sm">함께한 날</p>
          </div>
          <div className="h-full flex flex-col gap-2 justify-center items-center bg-primary/10 p-2">
            <h2 className="text-xl">2025.09.16</h2>
            <p className="text-gray-500 text-sm">특별한 날</p>
          </div>
          <div className="h-full flex flex-col gap-2 justify-center items-center bg-primary/10 p-2">
            <h2 className="text-xl">47</h2>
            <p className="text-gray-500 text-sm">함께한 코스</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-12">
        <div className="bg-third/60 text-white w-[120px] h-[40px] text-center py-2 rounded-md cursor-pointer border border-primary/10 text-gray-500 mt-4 hover:bg-third/80 transition-all duration-300">저장</div>
      </div>
    </div>
  );
};