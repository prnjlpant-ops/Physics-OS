import { useCallback, useEffect, useState } from 'react'
import SettingsService from '../services/SettingsService'

/**
 * useStudyPreferences
 * ====================
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * Reactive wrapper around the Study Preferences fields added to
 * `services/SettingsService.js` this sprint (Daily Study Goal, Preferred
 * Session Length already lives in `usePlannerSettings`/plannerConstants —
 * not duplicated here — plus Auto Save Notes, Default Subject, Remember
 * Last Topic).
 */
export function useStudyPreferences() {
  const [settings, setSettings] = useState(SettingsService.getSettings)

  useEffect(() => SettingsService.subscribe(() => setSettings(SettingsService.getSettings())), [])

  const updatePreference = useCallback((key, value) => {
    setSettings(SettingsService.updateSettings({ [key]: value }))
  }, [])

  return { settings, updatePreference }
}

export default useStudyPreferences
