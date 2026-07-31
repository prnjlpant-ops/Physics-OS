import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_KNOWLEDGE_BASE_ROOT_PATH } from '../constants/knowledgeBaseConstants'
import RecentFilesService from '../services/RecentFilesService'

const SETTINGS_STORAGE_KEY = 'physicsOS.knowledgeBaseSettings'
const SETTINGS_EVENT = 'physicsOS.knowledgeBaseSettingsChanged'

function readSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    const rootPath =
      parsed && typeof parsed === 'object' && typeof parsed.rootPath === 'string'
        ? parsed.rootPath
        : DEFAULT_KNOWLEDGE_BASE_ROOT_PATH
    return { rootPath }
  } catch {
    return { rootPath: DEFAULT_KNOWLEDGE_BASE_ROOT_PATH }
  }
}

function writeSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    window.dispatchEvent(new Event(SETTINGS_EVENT))
  } catch {
    // Local storage unavailable or full; setting won't persist, fail silently.
  }
}

/**
 * Sets the Knowledge Base root path outside of a React component — used by
 * `useDesktopMenu.js` when the native "Open Knowledge Base…" menu item
 * (Sprint 29B, electron/main/menu.cjs) already picked a folder via a
 * native dialog, before any component with `useKnowledgeBaseSettings()`
 * mounted has a chance to call `setRootPath`. Shares the exact same
 * storage key/event as the hook below so both stay in sync.
 */
export function setKnowledgeBaseRootPath(rootPath) {
  const previous = readSettings().rootPath
  writeSettings({ rootPath })
  if (previous) RecentFilesService.pushWorkspace(previous)
}

/**
 * Knowledge Base Settings — Root Path only, by design (Sprint 21). Stored
 * locally so the app remembers where the user keeps their Knowledge Base
 * folder on disk.
 *
 * Sprint 29B — Native Desktop Integration: every root path change (manual
 * typing, the Settings "Browse…" native folder picker, or the File menu)
 * records the *previous* root into `RecentFilesService`'s Recent
 * Workspaces list before switching, so the user can jump back to it.
 */
export function useKnowledgeBaseSettings() {
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

  const setRootPath = useCallback((rootPath) => {
    setSettings((current) => {
      if (current.rootPath && current.rootPath !== rootPath) {
        RecentFilesService.pushWorkspace(current.rootPath)
      }
      const next = { rootPath }
      writeSettings(next)
      return next
    })
  }, [])

  const resetRootPath = useCallback(() => {
    const next = { rootPath: DEFAULT_KNOWLEDGE_BASE_ROOT_PATH }
    writeSettings(next)
    setSettings(next)
  }, [])

  return { rootPath: settings.rootPath, setRootPath, resetRootPath }
}
