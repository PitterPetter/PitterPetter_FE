import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import courseList from "../../features/course/mocks/courseList.json";
import { CourseListItem } from "../../features/course";

export const CourseListPage = () => {
  const navigate = useNavigate();
  const mockData = courseList.data.reviews;

  return (
    <div className="w-full max-w-[800px] h-[100vh]">
      <div className="flex flex-col gap-4 p-4 pt-0 w-full">
        <div className="h-full border-gray-300 border rounded-2xl p-4 pb-6 w-full">
          <div className="flex gap-2 justify-between py-4">
            <div className="w-full font-bold">
              저장된 코스 목록
            </div>
            <Button variant="outlined" className="w-[170px]" onClick={() => {navigate("/diary")}}>새 다이어리 만들기</Button>
          </div>
          <div className="grid grid-cols-3 grid-rows-3 gap-4">
            {
              mockData.map((item) => (
                <CourseListItem key={item.id} {...item} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};