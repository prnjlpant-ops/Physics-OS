import { useEffect, useState } from 'react'
import RecentFilesService from '../services/RecentFilesService'

/**
 * Sprint 28 — Desktop Readiness Layer.
 *
 * React binding for RecentFilesService — Recent Files, Recent Topics,
 * Recently Opened Books, and Recently Solved Papers. Stays in sync across
 * tabs via StorageService's change events.
 */
export function useRecentItems() {
  const [state, setState] = useState(RecentFilesService.getAll)

  useEffect(() => RecentFilesService.subscribe(() => setState(RecentFilesService.getAll())), [])

  return {
    ...state,
    clear: RecentFilesService.clear,
  }
}

export default useRecentItems
