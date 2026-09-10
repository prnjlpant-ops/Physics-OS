import { useEffect, useState } from 'react'
import ProgressService from '../services/ProgressService'
import TaskService from '../services/TaskService'
import { SYLLABUS_STATUS_EVENT } from './useSyllabusStatus'
import { SESSIONS_CHANGED_EVENT } from '../utils/studySessionsStorage'

/**
 * useProgress
 * ===========
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * Live view over `ProgressService.getProgressSummary()`, recomputed
 * whenever a Study Session is saved, a Task changes, or a Topic's status
 * changes — the three stores the summary is built from.
 */
export function useProgress() {
  const [summary, setSummary] = useState(ProgressService.getProgressSummary)

  useEffect(() => {
    const refresh = () => setSummary(ProgressService.getProgressSummary())

    window.addEventListener(SESSIONS_CHANGED_EVENT, refresh)
    window.addEventListener('storage', refresh)
    window.addEventListener(SYLLABUS_STATUS_EVENT, refresh)
    const unsubscribeTasks = TaskService.subscribe(refresh)

    return () => {
      window.removeEventListener(SESSIONS_CHANGED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
      window.removeEventListener(SYLLABUS_STATUS_EVENT, refresh)
      unsubscribeTasks()
    }
  }, [])

  return summary
}

export default useProgress
