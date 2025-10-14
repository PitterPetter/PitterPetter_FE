import { api } from "../../shared/api/base";

export const getCourseList = () => api.get("/api/courses");
export const saveCourseApi = (course: any) => api.post("/api/courses", course);