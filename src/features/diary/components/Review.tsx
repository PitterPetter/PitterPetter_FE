import { useDiaryStore } from "../../../shared/store/diary.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faBell } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export const Review = () => {
  const { courseId, courseName, rating, setRating } = useDiaryStore();
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 p-2 md:p-4">
      <h1 className="text-xl md:text-2xl">리뷰</h1>
      
      {courseId && (
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="text-xs md:text-sm text-gray-600">
            선택된 코스: <span className="font-medium text-[#93000A]">{courseId}</span>
            {courseName && <span className="ml-2 text-gray-500">({courseName})</span>}
          </div>
          <div className="flex gap-3 md:gap-4 items-center">
            <div className="text-xs md:text-sm text-gray-600">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                className="text-xl md:text-2xl transition-colors duration-200 focus:outline-none"
              >
                <FontAwesomeIcon
                  icon={faStar}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'text-[#93000A]/60'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            </div>
            <div className="text-xs md:text-sm text-gray-600">
              {rating}/5
            </div>
          </div>
        </div>
      )}
      
      {!courseId && (
        <div className="text-sm md:text-base text-gray-500 text-center py-6 md:py-8">
          먼저 코스를 선택해주세요
        </div>
      )}
      <div className="flex justify-center items-center w-full gap-4">
        <div className="text-xs md:text-sm text-gray-600 flex items-center gap-2">
        <FontAwesomeIcon icon={faBell} className="w-[10px] h-[10px] md:w-[12px] md:h-[12px]" />
        리뷰 결과가 다음 추천 코스에 반영됩니다
        </div>
      </div>
    </div>
  );
};