import { api } from "../../shared/api/base";

export const getCourseList = () => api.get("/courses");
