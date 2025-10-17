import { create } from "zustand";
import { AuthStore } from "./type";

export const useAuthStore = create<AuthStore>((set) => ({
  permissionLevel: null,
  setPermissionLevel: (permissionLevel: "ONBOARDING_REQUIRED" | "COUPLE_MATCHING_REQUIRED" | "LOCK_REQUIRED" | "COMPLETED") => set({ permissionLevel }),
}));

