const SESSIONS_STORAGE_KEY = 'physicsOS.studySessions'

/**
 * Returns every completed study session stored locally, oldest first.
 * Safe to call from any future module (Analytics, Calendar, Progress, etc.)
 * without depending on the Study Timer being mounted.
 */
export function getAllStudySessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Persists a completed study session locally and returns the updated list.
 */
export function saveStudySession(session) {
  const sessions = getAllStudySessions()
  const updated = [...sessions, session]
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // Local storage unavailable or full; fail silently, no cloud fallback.
  }
  return updated
}

export function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
