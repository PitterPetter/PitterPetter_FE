import { api } from "../../shared/api/base";

export const onboardingApi = {
  saveOnboarding: (data: any) => api.post('/api/onboarding/me', data),
};