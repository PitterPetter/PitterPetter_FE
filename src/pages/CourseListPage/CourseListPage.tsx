import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourseList } from "../../features/course/api";
import { CourseListItem } from "../../features/course";
import { COURSE_STORAGE_KEY, normalizeCourses, readCoursesFromSession } from "../../features/course/utils/normalizeCourse";
import { injectTempToken } from "../../features/course/util/injectTempToken";
import type { Course } from "../../features/course/types";
import { Spinner } from "../../shared/ui/spinner";

export const CourseListPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;

    // 임시 토큰 주입 (로컬 테스트 전용)
    injectTempToken();

    setIsLoading(true);
    setError(null);

    // 세션에서 먼저 로드
    const fromSession = readCoursesFromSession();
    if (fromSession.length > 0) {
      setCourses(fromSession);
    }

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
        if (cancel) return;
        console.error("[course] 코스 목록을 불러오지 못했습니다.", error);
        setError(error.message || "코스 목록을 불러오는데 실패했습니다.");
      })
      .finally(() => {
        if (!cancel) {
          setIsLoading(false);
        }
      });

    return () => {
      cancel = true;
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start py-10 bg-primary/5">
      <div className="flex flex-col gap-4 p-4 pt-0 w-[900px]">
        <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6">
          <div className="flex gap-2 justify-between py-4">
            <div className="w-full text-2xl">
              코스
            </div>
            <div
              className="flex items-center justify-center gap-2 w-[210px] h-[42px] bg-third/60 text-white rounded-xl cursor-pointer border border-primary/10 hover:bg-third/80 transition-all duration-300"
              onClick={() => {navigate("/diary")}}
            >
              <FontAwesomeIcon icon={faPlus} className="w-[14px] h-[14px]" />
              새 다이어리 만들기
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-3 text-center py-8">
                <Spinner />
              </div>
            ) : error ? (
              <div className="col-span-3 text-center py-8 text-red-500">
                에러가 발생했습니다: {error}
              </div>
            ) : (
              courses.map((course) => (
                <CourseListItem key={course.course_id} course={course} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
