import { useCallback, useEffect, useState } from 'react'
import { ERROR_STATUS_ORDER } from '../constants/errorLearningConstants'

const STATUS_STORAGE_KEY = 'physicsOS.errorStatusOverrides'
const STATUS_EVENT = 'physicsOS.errorStatusChanged'

function readOverrides() {
  try {
    const raw = localStorage.getItem(STATUS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeOverrides(map) {
  try {
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(map))
    window.dispatchEvent(new Event(STATUS_EVENT))
  } catch {
    // Local storage unavailable or full; status won't persist, fail silently.
  }
}

/**
 * Local-first manual status tracking (Pending / Resolved) for errors.
 * No automatic analysis — the user marks their own resolution progress.
 */
export function useErrorStatus() {
  const [overrides, setOverrides] = useState(readOverrides)

  useEffect(() => {
    const sync = () => setOverrides(readOverrides())
    window.addEventListener(STATUS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(STATUS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const getStatus = useCallback(
    (error) => overrides[error.id] ?? error.status,
    [overrides],
  )

  const cycleStatus = useCallback(
    (error) => {
      setOverrides((prev) => {
        const current = prev[error.id] ?? error.status
        const index = ERROR_STATUS_ORDER.indexOf(current)
        const next = { ...prev, [error.id]: ERROR_STATUS_ORDER[(index + 1) % ERROR_STATUS_ORDER.length] }
        writeOverrides(next)
        return next
      })
    },
    [],
  )

  return { getStatus, cycleStatus }
}
