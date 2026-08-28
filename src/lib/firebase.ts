import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';
import { AnonymousQuizSessionPayload } from '../types';

export const APP_VERSION = '1.0.0';

// Firebase Client Configuration
const metaEnv = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || '',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: metaEnv.VITE_FIREBASE_APP_ID || '',
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || '',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

const hasValidConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== ''
);

if (hasValidConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  } catch (err) {
    console.warn('Firebase initialization note (offline mode fallback):', err);
  }
}

/**
 * Retrieves or generates an anonymous session ID stored only in sessionStorage.
 * Strictly avoids collecting PII (no names, IPs, emails).
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  const STORAGE_KEY = 'stou_quiz_session_id';
  let sessionId = sessionStorage.getItem(STORAGE_KEY);
  if (!sessionId) {
    sessionId = generateUniqueQuizAttemptId();
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  }
  return sessionId;
}

export function generateUniqueQuizAttemptId(): string {
  return 'stou_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
}

/**
 * Logs Firebase Analytics events safely.
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  try {
    const payload = {
      ...params,
      app_version: APP_VERSION,
      timestamp: Date.now(),
    };

    if (analytics) {
      logEvent(analytics, eventName, payload);
    }

    // Save event to local event log for exhibition admin metrics
    if (typeof window !== 'undefined') {
      const LOCAL_EVENTS_KEY = 'stou_local_analytics_events';
      const existingStr = localStorage.getItem(LOCAL_EVENTS_KEY);
      const list: any[] = existingStr ? JSON.parse(existingStr) : [];
      list.push({ eventName, payload });
      if (list.length > 500) list.shift();
      localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(list));
    }
  } catch (err) {
    console.warn(`Analytics event '${eventName}' dispatch note:`, err);
  }
}

/**
 * Saves completed quiz session to Firestore and local fallback cache.
 */
export async function saveQuizSession(sessionData: AnonymousQuizSessionPayload): Promise<boolean> {
  // Always record locally for real-time exhibition admin metrics
  if (typeof window !== 'undefined') {
    const LOCAL_SESSIONS_KEY = 'stou_local_quiz_sessions';
    try {
      const existingStr = localStorage.getItem(LOCAL_SESSIONS_KEY);
      const list: any[] = existingStr ? JSON.parse(existingStr) : [];
      list.push({
        ...sessionData,
        completedAt: new Date().toISOString(),
      });
      if (list.length > 300) list.shift();
      localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Local session cache write note:', e);
    }
  }

  // Attempt write to Firestore if configured
  if (db) {
    try {
      const docRef = doc(collection(db, 'quizSessions'), sessionData.sessionId);
      await setDoc(docRef, {
        ...sessionData,
        completedAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      console.warn('Firestore quiz session save note (saved to local store):', err);
    }
  }
  return true;
}

/**
 * Fetches all completed sessions from Firestore or local fallback for Admin Dashboard.
 */
export async function fetchQuizSessionsForAdmin(): Promise<AnonymousQuizSessionPayload[]> {
  const sessions: AnonymousQuizSessionPayload[] = [];

  if (db) {
    try {
      const q = query(collection(db, 'quizSessions'), orderBy('completedAt', 'desc'), limit(150));
      const snap = await getDocs(q);
      snap.forEach((doc) => {
        sessions.push(doc.data() as AnonymousQuizSessionPayload);
      });
      if (sessions.length > 0) {
        return sessions;
      }
    } catch (err) {
      console.warn('Firestore fetch note (using local cache):', err);
    }
  }

  // Fallback to local storage sessions
  if (typeof window !== 'undefined') {
    try {
      const localStr = localStorage.getItem('stou_local_quiz_sessions');
      if (localStr) {
        return JSON.parse(localStr).reverse();
      }
    } catch (e) {
      console.warn('Failed to parse local sessions:', e);
    }
  }

  return sessions;
}

/**
 * Fetches raw analytics event logs for aggregated admin dashboard computation.
 */
export function fetchAnalyticsEvents(): { eventName: string; payload: any }[] {
  if (typeof window === 'undefined') return [];
  try {
    const listStr = localStorage.getItem('stou_local_analytics_events');
    if (listStr) {
      return JSON.parse(listStr);
    }
  } catch (e) {
    console.warn('Local analytics parse note:', e);
  }
  return [];
}

/**
 * Fetches local analytics event counts for Admin Dashboard.
 */
export function fetchAnalyticsMetrics(): Record<string, number> {
  const counts: Record<string, number> = {
    quiz_viewed: 0,
    quiz_started: 0,
    quiz_completed: 0,
    quiz_restarted: 0,
    result_detail_clicked: 0,
    result_program_viewed: 0,
  };

  if (typeof window === 'undefined') return counts;

  try {
    const listStr = localStorage.getItem('stou_local_analytics_events');
    if (listStr) {
      const list: { eventName: string }[] = JSON.parse(listStr);
      list.forEach((item) => {
        if (counts[item.eventName] !== undefined) {
          counts[item.eventName]++;
        } else {
          counts[item.eventName] = 1;
        }
      });
    }
  } catch (e) {
    console.warn('Local analytics parse note:', e);
  }

  return counts;
}

/**
 * Resets local analytics events and saved sessions to start a fresh count cycle.
 */
export function resetAdminAnalyticsAndSessions(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem('stou_local_analytics_events');
    localStorage.removeItem('stou_local_quiz_sessions');
    sessionStorage.removeItem('stou_quiz_session_id');
    return true;
  } catch (e) {
    console.warn('Failed to reset analytics and sessions:', e);
    return false;
  }
}

export { db, analytics };
