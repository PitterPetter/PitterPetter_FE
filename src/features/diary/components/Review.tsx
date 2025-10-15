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
    <div className="flex flex-col gap-8 p-4">
      <h1 className="text-2xl">리뷰</h1>
      
      {courseId && (
        <div className="flex flex-col gap-4">
          <div className="text-sm text-gray-600">
            선택된 코스: <span className="font-medium text-pink-600">{courseId}</span>
            {courseName && <span className="ml-2 text-gray-500">({courseName})</span>}
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-sm text-gray-600">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                className="text-2xl transition-colors duration-200 focus:outline-none"
              >
                <FontAwesomeIcon
                  icon={faStar}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            </div>
            <div className="text-sm text-gray-600">
              {rating}/5
            </div>
          </div>
        </div>
      )}
      
      {!courseId && (
        <div className="text-gray-500 text-center py-8">
          먼저 코스를 선택해주세요
        </div>
      )}
      <div className="flex justify-center items-center w-full gap-4">
        <div className="text-sm text-gray-600 flex items-center gap-2">
        <FontAwesomeIcon icon={faBell} className="w-[12px] h-[12px]" />
        더 나은 서비스 환경을 위해 리뷰를 수집중입니다
        </div>
      </div>
    </div>
  );
};