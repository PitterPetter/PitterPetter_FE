// 예: useRecommendStore.ts
import { create } from 'zustand';

type State = {
  data: any[] | null;
  explain: string | null;
};

type Actions = {
  setData: (d: any[]) => void;
  setExplain: (s: string) => void;
  reset: () => void;
};

export const useRecommendStore = create<State & Actions>((set) => ({
  data: null,
  explain: null,
  setData: (d) => set({ data: d }),
  setExplain: (s) => set({ explain: s }),
  reset: () => set({ data: null, explain: null }),
}));
