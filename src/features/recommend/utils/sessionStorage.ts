import { Place } from '../../../shared/store/type';

const RECOMMEND_SESSION_KEY = 'pitterpetter_recommend_data';

export interface RecommendSessionData {
  explain: string;
  data: Place[];
  timestamp: number;
}

export const saveRecommendToSession = (explain: string, data: Place[]): void => {
  try {
    const sessionData: RecommendSessionData = {
      explain,
      data,
      timestamp: Date.now()
    };
    sessionStorage.setItem(RECOMMEND_SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Failed to save recommend data to session:', error);
  }
};

export const loadRecommendFromSession = (): RecommendSessionData | null => {
  try {
    const stored = sessionStorage.getItem(RECOMMEND_SESSION_KEY);
    if (!stored) return null;

    const sessionData: RecommendSessionData = JSON.parse(stored);
    
    // 24시간 후 만료 (선택사항)
    const isExpired = Date.now() - sessionData.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      clearRecommendFromSession();
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error('Failed to load recommend data from session:', error);
    clearRecommendFromSession();
    return null;
  }
};

export const clearRecommendFromSession = (): void => {
  try {
    sessionStorage.removeItem(RECOMMEND_SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear recommend data from session:', error);
  }
};

export const hasRecommendInSession = (): boolean => {
  return loadRecommendFromSession() !== null;
};
