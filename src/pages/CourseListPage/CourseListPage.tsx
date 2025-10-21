import { getCourseList } from "../../features/course/api";
import { CourseListItem } from "../../features/course";
import { COURSE_STORAGE_KEY, normalizeCourses, readCoursesFromSession } from "../../features/course/utils/normalizeCourse";
import type { Course } from "../../features/course/types";
import { Spinner } from "../../shared/ui/spinner";
import { useQuery } from "@tanstack/react-query";

export const CourseListPage = () => {
  const { data: courseList, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async (): Promise<Course[]> => {
      // 세션에서 먼저 로드
      const fromSession = readCoursesFromSession();
      if (fromSession.length > 0) {
        // 세션에 있으면 즉시 반환하고 백그라운드에서 API 호출
        setTimeout(() => {
          getCourseList()
            .then((response) => {
              // API 응답 데이터를 정규화
              const normalizedData = normalizeCourses(response.data);
              
              try {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(normalizedData));
                }
              } catch (error) {
                console.error("[course] 코스 데이터를 세션 스토리지에 저장하지 못했습니다.", error);
              }
            })
            .catch((error) => {
              console.error("[course] 코스 목록을 불러오지 못했습니다.", error);
            });
        }, 0);
        return fromSession;
      }
      
      // 세션에 없으면 API 호출
      const response = await getCourseList();
      
      // API 응답 데이터를 정규화
      const normalizedData = normalizeCourses(response.data);
      
      try {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(normalizedData));
        }
      } catch (error) {
        console.error("[course] 코스 데이터를 세션 스토리지에 저장하지 못했습니다.", error);
      }
      
      return normalizedData;
    },
    staleTime: 5 * 60 * 1000, // 5분간 fresh
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지 (cacheTime → gcTime)
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-start py-10 bg-primary/5">
      <div className="flex flex-col gap-4 p-4 pt-0 w-[900px]">
        <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6">
          <div className="flex gap-2 justify-between py-4">
            <div className="w-full text-2xl pb-3">
              코스
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-3 text-center py-8">
                <Spinner />
              </div>
            ) : error ? (
              <div className="col-span-3 text-center py-8 text-red-500">
                에러가 발생했습니다: {error.message}
              </div>
            ) : (
              courseList?.map((course: Course) => (
                <CourseListItem key={course.course_id} course={course} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
