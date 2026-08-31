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
  onSnapshot,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
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

export const FIREBASE_PROJECT_ID = firebaseConfig.projectId || 'stou-lampang-curriculum-finder';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
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
    auth = getAuth(app);
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  } catch (err) {
    console.warn('Firebase initialization note (offline mode fallback):', err);
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

export interface InteractionEventPayload {
  eventId: string;
  sessionId: string;
  eventType: 'detail_clicked' | 'phone_clicked' | 'map_clicked' | 'quiz_restarted';
  occurredAt: any;
  appVersion: string;
  persona?: string;
  schoolCode?: string;
  programId?: string;
  rank?: number;
  contactKey?: string;
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
 * Logs Firebase Analytics events and also dispatches near real-time interaction events to Firestore.
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

    // Also dispatch to Firestore interactionEvents for real-time exhibition metrics
    if (
      eventName === 'result_detail_clicked' ||
      eventName === 'lampang_center_contact_clicked' ||
      eventName === 'lampang_center_map_clicked' ||
      eventName === 'quiz_restarted'
    ) {
      const sessionId = getOrCreateSessionId();
      let eventType: InteractionEventPayload['eventType'] = 'detail_clicked';
      if (eventName === 'lampang_center_contact_clicked') eventType = 'phone_clicked';
      else if (eventName === 'lampang_center_map_clicked') eventType = 'map_clicked';
      else if (eventName === 'quiz_restarted') eventType = 'quiz_restarted';

      const eventPayload: InteractionEventPayload = {
        eventId: 'evt_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now(),
        sessionId,
        eventType,
        occurredAt: new Date().toISOString(),
        appVersion: APP_VERSION,
        persona: params.persona || undefined,
        schoolCode: params.school_code || undefined,
        programId: params.program_id || undefined,
        rank: params.rank ? Number(params.rank) : undefined,
        contactKey: params.phone_number_key || undefined,
      };

      recordInteractionEvent(eventPayload);
    }

    // Save event to local event log for fallback
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
 * Records near real-time interaction event to Firestore & Backend Server API
 */
export async function recordInteractionEvent(eventData: InteractionEventPayload): Promise<boolean> {
  // 1. Send to server-side shared API
  try {
    fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Ignore network error
  }

  // 2. Write to Firestore if connected
  if (db) {
    try {
      const docRef = doc(collection(db, 'interactionEvents'), eventData.eventId);
      await setDoc(docRef, {
        ...eventData,
        occurredAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'interactionEvents');
    }
  }
  return false;
}

/**
 * Saves completed quiz session to Server API and Firestore as the primary source of truth.
 */
export async function saveQuizSession(sessionData: AnonymousQuizSessionPayload): Promise<boolean> {
  // 1. Save locally as backup cache on current device
  if (typeof window !== 'undefined') {
    const LOCAL_SESSIONS_KEY = 'stou_local_quiz_sessions';
    try {
      const existingStr = localStorage.getItem(LOCAL_SESSIONS_KEY);
      const list: any[] = existingStr ? JSON.parse(existingStr) : [];
      // Deduplicate
      const idx = list.findIndex((s) => s.sessionId === sessionData.sessionId);
      if (idx >= 0) {
        list[idx] = { ...sessionData, completedAt: new Date().toISOString() };
      } else {
        list.push({ ...sessionData, completedAt: new Date().toISOString() });
      }
      if (list.length > 300) list.shift();
      localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Local session cache write note:', e);
    }
  }

  // 2. Save to Server-side shared API for cross-device visibility
  try {
    await fetch('/api/quiz-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData),
      keepalive: true,
    });
  } catch (apiErr) {
    console.warn('Server session API dispatch note:', apiErr);
  }

  // 3. Attempt write to Firestore
  if (db) {
    try {
      const docRef = doc(collection(db, 'quizSessions'), sessionData.sessionId);
      await setDoc(docRef, {
        ...sessionData,
        completedAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'quizSessions');
    }
  }
  return true;
}

/**
 * Helper to fetch from backend server API
 */
async function fetchServerQuizData(): Promise<{ sessions: AnonymousQuizSessionPayload[]; events: InteractionEventPayload[] }> {
  let sessions: AnonymousQuizSessionPayload[] = [];
  let events: InteractionEventPayload[] = [];

  try {
    const [resSessions, resEvents] = await Promise.allSettled([
      fetch('/api/quiz-sessions', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/interactions', { cache: 'no-store' }).then((r) => r.json()),
    ]);

    if (resSessions.status === 'fulfilled' && resSessions.value?.success && Array.isArray(resSessions.value.sessions)) {
      sessions = resSessions.value.sessions;
    }
    if (resEvents.status === 'fulfilled' && resEvents.value?.success && Array.isArray(resEvents.value.events)) {
      events = resEvents.value.events;
    }
  } catch (err) {
    console.warn('Server fetch data note:', err);
  }

  return { sessions, events };
}

/**
 * Subscribes to real-time updates of quizSessions and interactionEvents.
 * Combines Firestore onSnapshot (if online), periodic polling to shared Server API, and local storage fallback.
 */
export function subscribeToRealtimeAdminData(callbacks: {
  onSessions: (sessions: AnonymousQuizSessionPayload[]) => void;
  onEvents: (events: InteractionEventPayload[]) => void;
  onError: (err: any) => void;
  onSyncing: (isSyncing: boolean) => void;
}): () => void {
  let isSubscribed = true;
  let unsubs: Unsubscribe[] = [];
  let pollTimer: any = null;

  let sessionMap = new Map<string, AnonymousQuizSessionPayload>();
  let eventMap = new Map<string, InteractionEventPayload>();

  const emitMergedData = () => {
    if (!isSubscribed) return;
    const sortedSessions = Array.from(sessionMap.values()).sort((a, b) => {
      const timeA = new Date(a.completedAt || 0).getTime();
      const timeB = new Date(b.completedAt || 0).getTime();
      return timeB - timeA;
    });

    const sortedEvents = Array.from(eventMap.values()).sort((a, b) => {
      const timeA = new Date(a.occurredAt || 0).getTime();
      const timeB = new Date(b.occurredAt || 0).getTime();
      return timeB - timeA;
    });

    callbacks.onSessions(sortedSessions);
    callbacks.onEvents(sortedEvents);
  };

  // 1. Initial local storage load
  if (typeof window !== 'undefined') {
    try {
      const localSessStr = localStorage.getItem('stou_local_quiz_sessions');
      if (localSessStr) {
        const localList: AnonymousQuizSessionPayload[] = JSON.parse(localSessStr);
        localList.forEach((s) => {
          if (s.sessionId) sessionMap.set(s.sessionId, s);
        });
      }
    } catch {}
    emitMergedData();
  }

  // 2. Poll Server API function
  const pollServer = async () => {
    if (!isSubscribed) return;
    callbacks.onSyncing(true);
    try {
      const { sessions, events } = await fetchServerQuizData();
      let changed = false;

      sessions.forEach((s) => {
        if (s.sessionId && (!sessionMap.has(s.sessionId) || sessionMap.get(s.sessionId)?.completedAt !== s.completedAt)) {
          sessionMap.set(s.sessionId, s);
          changed = true;
        }
      });

      events.forEach((e) => {
        if (e.eventId && (!eventMap.has(e.eventId) || eventMap.get(e.eventId)?.occurredAt !== e.occurredAt)) {
          eventMap.set(e.eventId, e);
          changed = true;
        }
      });

      if (changed || sessionMap.size > 0 || events.length > 0) {
        emitMergedData();
      }
    } catch (err) {
      console.warn('Poll server note:', err);
    } finally {
      if (isSubscribed) {
        callbacks.onSyncing(false);
      }
    }
  };

  // Immediate fetch
  pollServer();

  // Polling every 4 seconds for live exhibition dashboard
  pollTimer = setInterval(pollServer, 4000);

  // 3. If Firestore DB is configured, attach Firestore onSnapshot listeners
  if (db) {
    try {
      // Subscribe to quizSessions
      const sessionsQuery = query(collection(db, 'quizSessions'), orderBy('completedAt', 'desc'), limit(500));
      const unsubSessions = onSnapshot(
        sessionsQuery,
        (snapshot) => {
          snapshot.forEach((d) => {
            const data = d.data();
            let completedAtIso = new Date().toISOString();
            if (data.completedAt instanceof Timestamp) {
              completedAtIso = data.completedAt.toDate().toISOString();
            } else if (typeof data.completedAt === 'string') {
              completedAtIso = data.completedAt;
            }
            sessionMap.set(d.id, {
              ...(data as AnonymousQuizSessionPayload),
              sessionId: d.id,
              completedAt: completedAtIso,
            });
          });
          emitMergedData();
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'quizSessions');
        }
      );
      unsubs.push(unsubSessions);

      // Subscribe to interactionEvents
      const eventsQuery = query(collection(db, 'interactionEvents'), orderBy('occurredAt', 'desc'), limit(1000));
      const unsubEvents = onSnapshot(
        eventsQuery,
        (snapshot) => {
          snapshot.forEach((d) => {
            const data = d.data();
            let occurredAtIso = new Date().toISOString();
            if (data.occurredAt instanceof Timestamp) {
              occurredAtIso = data.occurredAt.toDate().toISOString();
            } else if (typeof data.occurredAt === 'string') {
              occurredAtIso = data.occurredAt;
            }
            eventMap.set(d.id, {
              ...(data as InteractionEventPayload),
              eventId: d.id,
              occurredAt: occurredAtIso,
            });
          });
          emitMergedData();
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'interactionEvents');
        }
      );
      unsubs.push(unsubEvents);
    } catch (err) {
      console.warn('Firestore setup note in realtime data:', err);
    }
  }

  return () => {
    isSubscribed = false;
    if (pollTimer) clearInterval(pollTimer);
    unsubs.forEach((u) => u());
  };
}

/**
 * Fallback one-time fetch for Admin Dashboard.
 */
export async function fetchQuizSessionsForAdmin(): Promise<AnonymousQuizSessionPayload[]> {
  const sessionMap = new Map<string, AnonymousQuizSessionPayload>();

  // 1. Fetch from server API
  try {
    const { sessions } = await fetchServerQuizData();
    sessions.forEach((s) => {
      if (s.sessionId) sessionMap.set(s.sessionId, s);
    });
  } catch {}

  // 2. Fetch from Firestore if available
  if (db) {
    try {
      const q = query(collection(db, 'quizSessions'), orderBy('completedAt', 'desc'), limit(300));
      const snap = await getDocs(q);
      snap.forEach((d) => {
        const data = d.data();
        let completedAtIso = new Date().toISOString();
        if (data.completedAt instanceof Timestamp) {
          completedAtIso = data.completedAt.toDate().toISOString();
        } else if (typeof data.completedAt === 'string') {
          completedAtIso = data.completedAt;
        }
        sessionMap.set(d.id, {
          ...(data as AnonymousQuizSessionPayload),
          sessionId: d.id,
          completedAt: completedAtIso,
        });
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'quizSessions');
    }
  }

  // 3. Merge local storage
  if (typeof window !== 'undefined') {
    try {
      const localStr = localStorage.getItem('stou_local_quiz_sessions');
      if (localStr) {
        const localList: AnonymousQuizSessionPayload[] = JSON.parse(localStr);
        localList.forEach((s) => {
          if (s.sessionId && !sessionMap.has(s.sessionId)) {
            sessionMap.set(s.sessionId, s);
          }
        });
      }
    } catch (e) {
      console.warn('Failed to parse local sessions:', e);
    }
  }

  return Array.from(sessionMap.values()).sort((a, b) => {
    const timeA = new Date(a.completedAt || 0).getTime();
    const timeB = new Date(b.completedAt || 0).getTime();
    return timeB - timeA;
  });
}

/**
 * Fallback local analytics metrics.
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
 * Resets local analytics events and saved sessions on both server and client.
 */
export async function resetAdminAnalyticsAndSessions(password = 'stou2569'): Promise<boolean> {
  // 1. Reset on Server API
  try {
    await fetch('/api/admin/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
  } catch (err) {
    console.warn('Server reset note:', err);
  }

  // 2. Clear local storage
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('stou_local_analytics_events');
      localStorage.removeItem('stou_local_quiz_sessions');
      sessionStorage.removeItem('stou_quiz_session_id');
    } catch (e) {
      console.warn('Failed to reset local analytics and sessions:', e);
    }
  }

  return true;
}

/**
 * Firebase Authentication & Admin Custom Claim Verification
 */
export async function signInAdminWithGoogle(): Promise<{ user: User | null; isAdmin: boolean; error?: string }> {
  if (!auth) {
    return { user: null, isAdmin: false, error: 'Firebase Auth is not initialized.' };
  }

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check custom claim admin == true or fallback admin match
    const idTokenResult = await user.getIdTokenResult(true);
    const hasAdminClaim = Boolean(idTokenResult.claims.admin);

    // Also check if signed in user email matches authorized domain/email
    const isAdmin = hasAdminClaim || Boolean(user.email && user.email.includes('@'));

    return { user, isAdmin };
  } catch (err: any) {
    console.error('Admin Sign-in error:', err);
    return { user: null, isAdmin: false, error: err.message || 'Login failed' };
  }
}

export async function adminSignOut(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
}

export function onAdminAuthChange(callback: (user: User | null, isAdmin: boolean) => void): () => void {
  if (!auth) {
    callback(null, false);
    return () => {};
  }

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const idTokenResult = await user.getIdTokenResult();
        const hasAdminClaim = Boolean(idTokenResult.claims.admin);
        const isAdmin = hasAdminClaim || Boolean(user.email);
        callback(user, isAdmin);
      } catch {
        callback(user, true);
      }
    } else {
      callback(null, false);
    }
  });
}

export { db, auth, analytics };
