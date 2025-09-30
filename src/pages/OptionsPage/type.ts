export type Option = {
  user_choice: {
      start: number[];
    condition: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    drink_intent: boolean;
    food: string;
  };
};