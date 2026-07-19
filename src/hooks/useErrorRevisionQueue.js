import { useCallback, useEffect, useState } from 'react'
import { generateRevisionQueueSeed } from '../data/errorLearningData'

const REMOVED_STORAGE_KEY = 'physicsOS.errorRevisionQueueRemoved'
const PRIORITY_STORAGE_KEY = 'physicsOS.errorRevisionQueuePriority'
const QUEUE_EVENT = 'physicsOS.errorRevisionQueueChanged'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : fallback
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event(QUEUE_EVENT))
  } catch {
    // Local storage unavailable or full; queue changes won't persist, fail silently.
  }
}

/**
 * Local-first "Revision Queue" for errors marked pending review. Seeded
 * from pending errors, then only ever modified locally (remove / set
 * priority) — no spaced-repetition scheduling, no backend. Resolved/Pending
 * status and bookmarks come from useErrorStatus / useErrorBookmarks so the
 * data isn't duplicated across hooks.
 */
export function useErrorRevisionQueue() {
  const [removedIds, setRemovedIds] = useState(() => readJson(REMOVED_STORAGE_KEY, []))
  const [priorityMap, setPriorityMap] = useState(() => readJson(PRIORITY_STORAGE_KEY, {}))

  useEffect(() => {
    const sync = () => {
      setRemovedIds(readJson(REMOVED_STORAGE_KEY, []))
      setPriorityMap(readJson(PRIORITY_STORAGE_KEY, {}))
    }
    window.addEventListener(QUEUE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(QUEUE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const items = generateRevisionQueueSeed()
    .filter((error) => !removedIds.includes(error.id))
    .map((error) => ({ ...error, priority: priorityMap[error.id] ?? 'Medium' }))

  const removeItem = useCallback((errorId) => {
    setRemovedIds((prev) => {
      const next = prev.includes(errorId) ? prev : [...prev, errorId]
      writeJson(REMOVED_STORAGE_KEY, next)
      return next
    })
  }, [])

  const setPriority = useCallback((errorId, priority) => {
    setPriorityMap((prev) => {
      const next = { ...prev, [errorId]: priority }
      writeJson(PRIORITY_STORAGE_KEY, next)
      return next
    })
  }, [])

  return { items, removeItem, setPriority }
}
