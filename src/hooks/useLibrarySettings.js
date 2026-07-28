import { useCallback, useEffect, useState } from 'react'
import StorageService from '../services/StorageService'
import { DEFAULT_LIBRARY_SORT } from '../constants/libraryConstants'

const SETTINGS_KEY = 'library.settings'

const DEFAULTS = {
  defaultSorting: DEFAULT_LIBRARY_SORT,
  defaultSubject: 'all',
}

function readSettings() {
  const stored = StorageService.get(SETTINGS_KEY, {})
  return { ...DEFAULTS, ...(stored && typeof stored === 'object' ? stored : {}) }
}

/**
 * Sprint 24 — Knowledge Base & Resource Engine. Settings section.
 *
 * Library-specific settings — Default Sorting and Default Subject (the
 * Knowledge Base Root Path shown alongside these on the Library Settings
 * page is a read-only placeholder sourced straight from
 * `knowledgeBaseConfig.json`, not stored here). Persisted through
 * StorageService, separate from the existing per-subject
 * `useKnowledgeBaseSettings` hook, which owns a different feature's root
 * path and is left untouched.
 */
export function useLibrarySettings() {
  const [settings, setSettings] = useState(readSettings)

  useEffect(() => StorageService.subscribe(SETTINGS_KEY, () => setSettings(readSettings())), [])

  const updateSettings = useCallback((changes) => {
    setSettings((prev) => {
      const next = { ...prev, ...changes }
      StorageService.set(SETTINGS_KEY, next)
      return next
    })
  }, [])

  const resetSettings = useCallback(() => {
    StorageService.set(SETTINGS_KEY, DEFAULTS)
    setSettings(DEFAULTS)
  }, [])

  return { ...settings, updateSettings, resetSettings }
}
