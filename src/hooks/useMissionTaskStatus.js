import { useCallback, useEffect, useState } from 'react'
import { TASK_STATUS } from '../constants/dailyStudyConstants'

const STATUS_STORAGE_KEY = 'physicsOS.missionTaskStatus'
const STATUS_EVENT = 'physicsOS.missionTaskStatusChanged'

function readStatusMap() {
  try {
    const raw = localStorage.getItem(STATUS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStatusMap(map) {
  try {
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(map))
    window.dispatchEvent(new Event(STATUS_EVENT))
  } catch {
    // Local storage unavailable or full; task status won't persist, fail silently.
  }
}

/**
 * Local-first status tracker for Today's Mission tasks (Pending / In
 * Progress / Completed). Since "today's" topic is itself derived live from
 * the syllabus's own status (see dailyStudyService.js), a task's id is
 * stable for as long as its topic stays in focus — no daily reset needed;
 * moving on to the next topic naturally produces fresh task ids.
 *
 * UI-only: no scheduling, no notifications. "Start Session" marks a task
 * In Progress and points at its existing resource page; "Mark Complete"
 * marks it Completed.
 */
export function useMissionTaskStatus() {
  const [overrides, setOverrides] = useState(readStatusMap)

  useEffect(() => {
    const sync = () => setOverrides(readStatusMap())
    window.addEventListener(STATUS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(STATUS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const setTaskStatus = useCallback((taskId, status) => {
    setOverrides((prev) => {
      const next = { ...prev, [taskId]: status }
      writeStatusMap(next)
      return next
    })
  }, [])

  const startTask = useCallback((taskId) => setTaskStatus(taskId, TASK_STATUS.IN_PROGRESS), [setTaskStatus])
  const completeTask = useCallback((taskId) => setTaskStatus(taskId, TASK_STATUS.COMPLETED), [setTaskStatus])

  return { overrides, setTaskStatus, startTask, completeTask }
}
