import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getCourse from "../../features/course/mocks/getCourse.json";
import { CourseListItem } from "../../features/course";

const COURSE_STORAGE_KEY = "pitterpetter:courses";

export const CourseListPage = () => {
  const navigate = useNavigate();
  const mockData = getCourse.map((course) => ({
    id: course.courseId,
    comment: course.description,
    created_at: new Date().toISOString(),
  }));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      sessionStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(getCourse));
      console.info("[course] CourseListPage 진입 시 코스 데이터를 세션 스토리지에 저장했습니다.");

      const storedRaw = sessionStorage.getItem(COURSE_STORAGE_KEY);
      const storedParsed = storedRaw ? JSON.parse(storedRaw) : null;
      console.info("[course] 저장된 세션 스토리지 값:", storedParsed);
    } catch (error) {
      console.error("[course] 코스 데이터를 세션 스토리지에 저장하지 못했습니다.", error);
    }
  }, []);

  return (
    <div className="w-full max-w-[800px] h-[100vh]">
      <div className="flex flex-col gap-4 p-4 pt-0 w-full">
        <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6 w-full">
          <div className="flex gap-2 justify-between items-center py-4">
            <div className="w-full font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faComment} className="text-[#662B2B]" />
              <span>저장된 코스 목록</span>
            </div>
            <Button variant="outlined" className="w-[170px]" onClick={() => {navigate("/diary")}}>새 다이어리 만들기</Button>
          </div>
          <div className="grid grid-cols-3 grid-rows-3 gap-4">
            {
              mockData.map((course) => (
                <CourseListItem key={course.id} {...course} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};
