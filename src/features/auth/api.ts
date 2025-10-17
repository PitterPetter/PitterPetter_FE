import { api } from "../../shared/api/base";

export const authApi = {
  getStatus: () => api.get<{ status: string }>("/auth/status"),
};
