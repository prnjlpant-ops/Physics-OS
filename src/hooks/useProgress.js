import { useEffect, useState } from 'react'
import ProgressService from '../services/ProgressService'
import TaskService from '../services/TaskService'
import TopicProgressService from '../engine/topics/topicProgressService'
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
    const unsubscribeTasks = TaskService.subscribe(refresh)
    const unsubscribeTopics = TopicProgressService.subscribeToProgress(refresh)

    return () => {
      window.removeEventListener(SESSIONS_CHANGED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
      unsubscribeTasks()
      unsubscribeTopics()
    }
  }, [])

  return summary
}

export default useProgress
