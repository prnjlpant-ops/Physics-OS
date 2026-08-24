const SESSIONS_STORAGE_KEY = 'physicsOS.studySessions'
// Sprint 27: lets same-tab consumers (ProgressService/useProgress, Calendar)
// react immediately when a session is saved, instead of only picking it up
// on next mount or via the native cross-tab `storage` event.
export const SESSIONS_CHANGED_EVENT = 'physicsOS.studySessionsChanged'

/**
 * Returns every completed study session stored locally, oldest first.
 * Safe to call from any future module (Analytics, Calendar, Progress, etc.)
 * without depending on the Study Timer being mounted.
 */
export function getAllStudySessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    const migrated = parsed.map((session) => ({ ...session, date: localDateKey(session.startTime ?? session.endTime) }))
    if (migrated.some((session, index) => session.date !== parsed[index].date)) {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(migrated))
    }
    return migrated
  } catch {
    return []
  }
}

function localDateKey(input) {
  const date = new Date(input ?? Date.now())
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Persists a completed study session locally and returns the updated list.
 */
export function saveStudySession(session) {
  const sessions = getAllStudySessions()
  const updated = [...sessions, session]
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event(SESSIONS_CHANGED_EVENT))
  } catch {
    // Local storage unavailable or full; fail silently, no cloud fallback.
  }
  return updated
}

/** Updates a saved session without changing its original start/end time or day. */
export function updateStudySession(sessionId, changes) {
  const sessions = getAllStudySessions()
  const updated = sessions.map((session) => session.id === sessionId
    ? { ...session, ...changes, date: localDateKey(session.startTime ?? session.endTime) }
    : session)
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event(SESSIONS_CHANGED_EVENT))
  } catch {
    // Keep the in-memory return value usable when local storage is unavailable.
  }
  return updated
}

export function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
