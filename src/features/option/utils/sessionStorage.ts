import { Option } from '../types';

const OPTION_SESSION_KEY = 'pitterpetter_option_data';

export interface OptionSessionData {
  user_choice: Option;
  timestamp: number;
}

export const saveOptionToSession = (user_choice: Option): void => {
  try {
    const sessionData: OptionSessionData = {
      user_choice,
      timestamp: Date.now()
    };
    sessionStorage.setItem(OPTION_SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Failed to save option data to session:', error);
  }
};

export const loadOptionFromSession = (): OptionSessionData | null => {
  try {
    const stored = sessionStorage.getItem(OPTION_SESSION_KEY);
    if (!stored) return null;

    const sessionData: OptionSessionData = JSON.parse(stored);
    const isExpired = Date.now() - sessionData.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      clearOptionFromSession();
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error('Failed to load option data from session:', error);
    clearOptionFromSession();
    return null;
  }
};

export const clearOptionFromSession = (): void => {
  try {
    sessionStorage.removeItem(OPTION_SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear option data from session:', error);
  }
};

export const hasOptionInSession = (): boolean => {
  return loadOptionFromSession() !== null;
};
