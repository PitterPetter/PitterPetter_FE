import { create } from "zustand";
import { AuthStore } from "./type";

export const useAuthStore = create<AuthStore>((set) => ({
  permissionLevel: '',
  setPermissionLevel: (permissionLevel: "ONBOARDING_REQUIRED" | "COUPLE_MATCHING_REQUIRED" | "ROCK_REQUIRED" | "COMPLETED" | '' |null) => set({ permissionLevel }),
}));

