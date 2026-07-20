import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_PLANNER_SETTINGS } from '../constants/plannerConstants'

const SETTINGS_STORAGE_KEY = 'physicsOS.plannerSettings'
const SETTINGS_EVENT = 'physicsOS.plannerSettingsChanged'

function readSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return { ...DEFAULT_PLANNER_SETTINGS, ...(parsed && typeof parsed === 'object' ? parsed : {}) }
  } catch {
    return DEFAULT_PLANNER_SETTINGS
  }
}

function writeSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    window.dispatchEvent(new Event(SETTINGS_EVENT))
  } catch {
    // Local storage unavailable or full; settings won't persist, fail silently.
  }
}

/**
 * Planner Settings — Daily Study Hours, Preferred Session Length, Break
 * Length, Maximum Tasks Per Day. UI only, by design (Sprint 19B): stored
 * locally so the fields remember what the user typed, but nothing in the
 * Planner Service reads these to change task placement, timing, or count.
 * A later sprint can wire them into real scheduling without touching this
 * storage shape.
 */
export function usePlannerSettings() {
  const [settings, setSettings] = useState(readSettings)

  useEffect(() => {
    const sync = () => setSettings(readSettings())
    window.addEventListener(SETTINGS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SETTINGS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value }
      writeSettings(next)
      return next
    })
  }, [])

  const resetSettings = useCallback(() => {
    writeSettings(DEFAULT_PLANNER_SETTINGS)
    setSettings(DEFAULT_PLANNER_SETTINGS)
  }, [])

  return { settings, updateSetting, resetSettings }
}
