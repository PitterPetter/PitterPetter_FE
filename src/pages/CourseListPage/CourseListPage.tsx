import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourseList } from "../../features/course/api";
import { CourseListItem } from "../../features/course";
import { COURSE_STORAGE_KEY, normalizeCourses, readCoursesFromSession } from "../../features/course/utils/normalizeCourse";
import { injectTempToken } from "../../features/course/util/injectTempToken";
import type { Course } from "../../features/course/types";

export const CourseListPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(() => {
    const fromSession = readCoursesFromSession();
    if (fromSession.length > 0) {
      return fromSession;
    }
    return [];
  });

  useEffect(() => {
    let cancel = false;

    // 임시 토큰 주입 (로컬 테스트 전용)
    injectTempToken();

    getCourseList()
      .then((response) => {
        if (cancel) return;
        const normalized = normalizeCourses(response.data);
        setCourses(normalized);
        try {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(normalized));
          }
        } catch (error) {
          console.error("[course] 코스 데이터를 세션 스토리지에 저장하지 못했습니다.", error);
        }
      })
      .catch((error) => {
        console.error("[course] 코스 목록을 불러오지 못했습니다.", error);
      });

    return () => {
      cancel = true;
    };
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
              courses.map((course) => (
                <CourseListItem key={course.course_id} course={course} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};
