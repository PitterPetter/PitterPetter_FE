import { useNavigate } from "react-router-dom";
import type { Course } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

export function CourseListItem({ course }: { course: Course }) {
  const navigate = useNavigate();
  return (
    <div className="group relative flex flex-col h-[120px] bg-white border border-gray-200 rounded-[12px] transition-all duration-200 cursor-pointer hover:shadow-sm transition-shadow duration-200"
      onClick={() => { navigate(`/course/${course.course_id}`); }}
    >
      <div className="h-10 bg-primary rounded-t-[11px] flex items-end px-2 pb-1 group-hover:bg-primary/80 transition-all duration-200">
        <h2 className="text-white font-medium text-md truncate flex items-center gap-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="w-[16px] h-[16px]" />
          {course.title}
        </h2>
      </div>
      
      <div className="flex-1 p-4">
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{course.description}</p>
      </div>
    </div>
  );
}
