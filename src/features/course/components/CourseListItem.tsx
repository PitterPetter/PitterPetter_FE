import { useNavigate } from "react-router-dom";
import type { Course } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

export function CourseListItem({ course }: { course: Course }) {
  const navigate = useNavigate();
  return (
    <div className="group relative flex flex-col h-[120px] w-[200px] bg-white border border-gray-200 rounded-[12px] transition-all duration-200 cursor-pointer hover:shadow-sm transition-shadow duration-200"
      onClick={() => { navigate(`/course/${course.course_id}`); }}
    >
      <div className="ml-2 group-hover:ml-0 h-10 overflow-hidden rounded-tr-lg rounded-bl-lg rounded-tl-none group-hover:rounded-bl-none group-hover:rounded-tl-lg rounded-tl-lg bg-third flex items-end px-2 flex justify-start items-center transition-all duration-200">
        <h2 className="text-white font-medium text-md truncate flex items-center gap-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="w-[16px] h-[16px]" />
          {course.title}
        </h2>
      </div>
      
      <div className="flex-1 p-4 ">
        <p className="text-sm text-gray-600 group-hover:text-gray-900 leading-relaxed line-clamp-2">{course.description}</p>
      </div>
    </div>
  );
}
