import { useNavigate } from "react-router-dom";
import type { Course } from "../types";

export function CourseListItem({ course }: { course: Course }) {
  const navigate = useNavigate();
  return (
    <div className="group relative flex flex-col h-[320px] bg-white border border-gray-200 rounded-[12px] transition-all duration-200 cursor-pointer hover:shadow-sm transition-shadow duration-200"
      onClick={() => { navigate(`/course/${course.course_id}`); }}
    >
      <div className="h-16 bg-primary rounded-t-[11px] flex items-end px-4 pb-3 group-hover:bg-primary/80 transition-all duration-200">
        <h2 className="text-white font-medium text-lg">{course.title}</h2>
      </div>
      
      <div className="flex-1 p-4">
        <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
      </div>
    </div>
  );
}
