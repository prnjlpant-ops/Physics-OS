import { useCallback, useEffect, useState } from 'react'

const QUEUE_STORAGE_KEY = 'physicsOS.pyqRevisionQueue'
const QUEUE_EVENT = 'physicsOS.pyqRevisionQueueChanged'

function readQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeQueue(ids) {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(ids))
    window.dispatchEvent(new Event(QUEUE_EVENT))
  } catch {
    // Local storage unavailable or full; queue won't persist, fail silently.
  }
}

/**
 * Local-first "Revision Queue" for PYQs — a simple list of question ids the
 * user wants to revisit. No spaced repetition scheduling, no backend.
 */
export function usePyqRevisionQueue() {
  const [queuedIds, setQueuedIds] = useState(readQueue)

  useEffect(() => {
    const sync = () => setQueuedIds(readQueue())
    window.addEventListener(QUEUE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(QUEUE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const toggleQueued = useCallback((pyqId) => {
    setQueuedIds((prev) => {
      const next = prev.includes(pyqId)
        ? prev.filter((id) => id !== pyqId)
        : [...prev, pyqId]
      writeQueue(next)
      return next
    })
  }, [])

  return { queuedIds, toggleQueued }
}
