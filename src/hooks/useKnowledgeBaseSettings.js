import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_KNOWLEDGE_BASE_ROOT_PATH } from '../constants/knowledgeBaseConstants'

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
 * Knowledge Base Settings — Root Path only, by design (Sprint 21). Stored
 * locally so the app remembers where the user keeps their Knowledge Base
 * folder on disk. Nothing here reads that folder; the path is only ever
 * used to compute display strings for future local file integration.
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
    setSettings(() => {
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
