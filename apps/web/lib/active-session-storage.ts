import type { SessionResponse } from '@project-fluent/api-contracts';

/**
 * Carries a freshly-generated Session from the Dashboard to the Learning
 * Session Page. No backend "read a Session" operation exists (M18 defines
 * none for Sprint 5's scope), so the Session returned by GenerateSession's
 * own response is the only copy of its content available — this is a
 * purely client-side handoff, not an authoritative store (per M19, frontend
 * state is always a temporary reflection, never a source of truth).
 *
 * Uses localStorage (survives a page refresh or closed tab) rather than
 * sessionStorage, since the Learning Session Page's Context-Dependent
 * access (M25) depends entirely on this value being present.
 */
const ACTIVE_SESSION_STORAGE_KEY = 'project-fluent:active-session';

export function saveActiveSession(session: SessionResponse): void {
  window.localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function loadActiveSession(): SessionResponse | null {
  const raw = window.localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as SessionResponse;
  } catch {
    return null;
  }
}

export function clearActiveSession(): void {
  window.localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
}
