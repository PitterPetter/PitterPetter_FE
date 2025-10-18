import { create } from "zustand";
import { AuthStore } from "./type";

export const useAuthStore = create<AuthStore>((set) => ({
  permissionLevel: 'COUPLE_MATCHING_REQUIRED',
  setPermissionLevel: (permissionLevel: "ONBOARDING_REQUIRED" | "COUPLE_MATCHING_REQUIRED" | "LOCK_REQUIRED" | "COMPLETED" | null) => set({ permissionLevel }),
}));

