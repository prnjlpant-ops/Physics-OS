import { useCallback, useEffect, useState } from 'react'
import { EXAMS } from '../constants/mockTestConstants'

const SETTINGS_STORAGE_KEY = 'physicsOS.mockTestSettings'
const SETTINGS_EVENT = 'physicsOS.mockTestSettingsChanged'

const DEFAULT_SETTINGS = {
  preferredExam: EXAMS[0],
  defaultDuration: 60,
  defaultDifficulty: 'Moderate',
  paletteStyle: 'Grid',
  theme: 'Dark',
}

function readSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return { ...DEFAULT_SETTINGS, ...(parsed && typeof parsed === 'object' ? parsed : {}) }
  } catch {
    return DEFAULT_SETTINGS
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
 * Local-first Mock Test System settings (preferred exam, default duration,
 * default difficulty, palette style, theme). UI only — no account sync.
 */
export function useMockSettings() {
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

  return { settings, updateSetting }
}
