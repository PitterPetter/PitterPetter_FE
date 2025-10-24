import { create } from "zustand";
import { Onboarding, DrinkingList, ActiveList, AtmosphereList, FoodList, CostList } from "./type";

export const useOnboardingStore = create<Onboarding>((set) => ({
  alcoholPreference: 0,
  activeBound: 0,
  dateCostPreference: '',
  favoriteFoodCategories: [],
  atmosphere: '',
  answeredCount: 0,
  setAnsweredCount: (value: number) => set({ answeredCount: value }),
  setAlcoholPreference: (value: DrinkingList) => set({ alcoholPreference: value }),
  setActiveBound: (value: ActiveList) => set({ activeBound: value }),
  setDateCostPreference: (value: CostList) => set({ dateCostPreference: value }),
  setFavoriteFoodCategories: (value: FoodList[] | ((prev: FoodList[]) => FoodList[])) => set((state) => ({ favoriteFoodCategories: typeof value === 'function' ? value(state.favoriteFoodCategories) : value })),
  setAtmosphere: (value: AtmosphereList) => set({ atmosphere: value }),
}));