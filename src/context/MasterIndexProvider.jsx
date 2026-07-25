import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { MASTER_INDEX_STORAGE_KEY, MASTER_INDEX_EVENT } from '../constants/masterIndexConstants'
import {
  createDefaultMasterIndex,
  validateMasterIndex,
  parseMasterIndexJson,
  exportMasterIndexJson,
  getSubjectResources,
  getCategoryResources,
  getResourcesByCategory,
} from '../engine/masterIndexService'

/**
 * MASTER INDEX PROVIDER
 * ======================
 * Sprint 22 — Master Index Engine.
 *
 * The single source of truth for every resource record in the app. Reads
 * the Master Index from localStorage on first load (seeding it with
 * engine/masterIndexService's default placeholders the very first time the
 * app runs), and keeps every component that calls useMasterIndex() in
 * sync — including across browser tabs.
 *
 * NO AUTOMATIC DISK SCANNING. NO DATABASE. NO CLOUD SYNC. The only ways
 * the index changes are: (1) the seeded defaults on first run, (2)
 * Import Master Index (Settings -> Master Index), or (3) a future
 * sprint's edit UI calling the same setters this provider exposes.
 *
 * ARCHITECTURE NOTE — reuse: this provider is intentionally generic
 * (subjectId + categoryKey, not "Knowledge Base" specific). Future
 * modules — Notes, Formula Sheets, Memory Sheets, PYQs, Study Session,
 * Today's Mission — can read and write through this same context instead
 * of inventing their own storage, by giving their records a categoryKey of
 * their own alongside the existing Knowledge Base categories.
 */

function readStoredIndex() {
  try {
    const raw = localStorage.getItem(MASTER_INDEX_STORAGE_KEY)
    if (!raw) return null
    const { index } = validateMasterIndex(JSON.parse(raw))
    return index
  } catch {
    return null
  }
}

function writeStoredIndex(index) {
  try {
    localStorage.setItem(MASTER_INDEX_STORAGE_KEY, JSON.stringify(index))
    window.dispatchEvent(new Event(MASTER_INDEX_EVENT))
    return true
  } catch {
    // Local storage unavailable or full; index won't persist, fail silently.
    return false
  }
}

function loadOrSeedIndex() {
  const stored = readStoredIndex()
  if (stored) return stored

  const defaults = createDefaultMasterIndex()
  writeStoredIndex(defaults)
  return defaults
}

const MasterIndexContext = createContext(null)

export function MasterIndexProvider({ children }) {
  const [index, setIndex] = useState(loadOrSeedIndex)

  useEffect(() => {
    const sync = () => setIndex(readStoredIndex() ?? loadOrSeedIndex())
    window.addEventListener(MASTER_INDEX_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(MASTER_INDEX_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  /** Import Master Index — JSON only, validated, never throws. Replaces the whole index on success. */
  const importFromJson = useCallback((jsonString) => {
    const { index: parsedIndex, warnings, error } = parseMasterIndexJson(jsonString)
    if (error || !parsedIndex) {
      return { success: false, error, warnings: [] }
    }
    writeStoredIndex(parsedIndex)
    setIndex(parsedIndex)
    return { success: true, error: null, warnings }
  }, [])

  /** Export Master Index — returns a JSON string ready to be downloaded as knowledge_base.json. */
  const exportToJson = useCallback(() => exportMasterIndexJson(index), [index])

  const resetToDefault = useCallback(() => {
    const defaults = createDefaultMasterIndex()
    writeStoredIndex(defaults)
    setIndex(defaults)
  }, [])

  const value = useMemo(
    () => ({
      masterIndex: index,
      getSubjectResources: (subjectId) => getSubjectResources(index, subjectId),
      getCategoryResources: (subjectId, categoryKey) =>
        getCategoryResources(index, subjectId, categoryKey),
      getResourcesByCategory: (categoryKey) => getResourcesByCategory(index, categoryKey),
      importFromJson,
      exportToJson,
      resetToDefault,
    }),
    [index, importFromJson, exportToJson, resetToDefault],
  )

  return <MasterIndexContext.Provider value={value}>{children}</MasterIndexContext.Provider>
}

export function useMasterIndex() {
  const context = useContext(MasterIndexContext)
  if (!context) {
    throw new Error('useMasterIndex must be used within a MasterIndexProvider')
  }
  return context
}
