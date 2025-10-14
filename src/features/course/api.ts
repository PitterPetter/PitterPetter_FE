import { api } from "../../shared/api/base";

export const getCourseList = () => api.get("/api/courses");
