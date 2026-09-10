import { useEffect, useState } from 'react'
import { getAllStudySessions, SESSIONS_CHANGED_EVENT } from '../utils/studySessionsStorage'

/** Reactive access to saved sessions for chapter/topic activity displays. */
export function useStudySessions() {
  const [sessions, setSessions] = useState(getAllStudySessions)

  useEffect(() => {
    const refresh = () => setSessions(getAllStudySessions())
    window.addEventListener(SESSIONS_CHANGED_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(SESSIONS_CHANGED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return sessions
}

export default useStudySessions
