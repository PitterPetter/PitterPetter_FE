export type RecommendStop = {
  id?: string;
  seq: number;
  name: string;
  category: string;
  lat?: number;
  lng?: number;
  indoor?: boolean;
  price_level?: number;
  alcohol?: boolean | 0 | 1;
  mood_tag?: number;
  food_tag?: string[];
  rating_avg?: number;
  open_hours?: Record<string, string> | string | null;
  link?: string;
};
