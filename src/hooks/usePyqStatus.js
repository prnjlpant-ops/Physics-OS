import { useCallback, useEffect, useState } from 'react'
import { PYQ_STATUS, PYQ_STATUS_ORDER } from '../constants/pyqConstants'

const STATUS_STORAGE_KEY = 'physicsOS.pyqStatusOverrides'
const STATUS_EVENT = 'physicsOS.pyqStatusChanged'

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

function nextStatus(current) {
  const index = PYQ_STATUS_ORDER.indexOf(current)
  return PYQ_STATUS_ORDER[(index + 1) % PYQ_STATUS_ORDER.length]
}

/**
 * Local-first manual status tracking (Unsolved / Attempted / Solved).
 * No automatic evaluation — the user marks their own progress.
 */
export function usePyqStatus() {
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
    (pyq) => overrides[pyq.id] ?? pyq.status ?? PYQ_STATUS.UNSOLVED,
    [overrides],
  )

  const cycleStatus = useCallback(
    (pyq) => {
      setOverrides((prev) => {
        const current = prev[pyq.id] ?? pyq.status ?? PYQ_STATUS.UNSOLVED
        const next = { ...prev, [pyq.id]: nextStatus(current) }
        writeOverrides(next)
        return next
      })
    },
    [],
  )

  return { getStatus, cycleStatus }
}
