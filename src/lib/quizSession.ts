import { ScoringResult, UserAnswers } from '../types';
import { APP_VERSION } from './firebase';

export const QUIZ_RESULT_SESSION_KEY = 'stou_quiz_result_2569';

export interface StoredQuizSessionData {
  scoringResult: ScoringResult;
  answers: UserAnswers;
  primaryPersona: string;
  appVersion: string;
  savedAt: string; // ISO string
}

/**
 * Saves the latest completed quiz result and answers to sessionStorage.
 * Strictly avoids storing any Personally Identifiable Information (PII).
 */
export function saveQuizResultSession(
  scoringResult: ScoringResult,
  answers: UserAnswers
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const payload: StoredQuizSessionData = {
      scoringResult,
      answers,
      primaryPersona: scoringResult.primaryPathway?.id || '',
      appVersion: APP_VERSION,
      savedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(QUIZ_RESULT_SESSION_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.warn('SessionStorage write error (safe fallback ignored):', error);
    return false;
  }
}

/**
 * Retrieves the stored quiz result from sessionStorage if available.
 */
export function getQuizResultSession(): StoredQuizSessionData | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem(QUIZ_RESULT_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredQuizSessionData;
    if (parsed && parsed.scoringResult && parsed.scoringResult.primaryPathway) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.warn('SessionStorage read error (safe fallback ignored):', error);
    return null;
  }
}

/**
 * Clears the quiz result from sessionStorage.
 * Called ONLY when the user explicitly clicks "ทำแบบทดสอบอีกครั้ง" (Restart Quiz).
 */
export function clearQuizResultSession(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    sessionStorage.removeItem(QUIZ_RESULT_SESSION_KEY);
    return true;
  } catch (error) {
    console.warn('SessionStorage clear error:', error);
    return false;
  }
}
