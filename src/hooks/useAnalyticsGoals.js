import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_GOALS_MINUTES } from '../constants/analyticsConstants'

const GOALS_STORAGE_KEY = 'physicsOS.analyticsGoals'
const GOALS_EVENT = 'physicsOS.analyticsGoalsChanged'

function readGoals() {
  try {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return { ...DEFAULT_GOALS_MINUTES, ...(parsed && typeof parsed === 'object' ? parsed : {}) }
  } catch {
    return DEFAULT_GOALS_MINUTES
  }
}

function writeGoals(goals) {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals))
    window.dispatchEvent(new Event(GOALS_EVENT))
  } catch {
    // Local storage unavailable or full; goals won't persist, fail silently.
  }
}

/**
 * Daily / weekly / monthly study goal targets (in minutes). These are
 * user-set targets only — no reminders, no notifications, no AI-suggested
 * goals. Progress against these targets is always computed from real
 * study sessions, never stored separately.
 */
export function useAnalyticsGoals() {
  const [goals, setGoalsState] = useState(readGoals)

  useEffect(() => {
    const sync = () => setGoalsState(readGoals())
    window.addEventListener(GOALS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(GOALS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const setGoal = useCallback((key, minutes) => {
    setGoalsState((prev) => {
      const next = { ...prev, [key]: minutes }
      writeGoals(next)
      return next
    })
  }, [])

  return { goals, setGoal }
}
