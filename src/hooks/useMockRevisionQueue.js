import { useCallback, useEffect, useState } from 'react'
import { generateRevisionQueueSeed } from '../data/mockTestsData'
import { REVISION_STATUS } from '../constants/mockTestConstants'

const QUEUE_STORAGE_KEY = 'physicsOS.mockRevisionQueue'
const REMOVED_STORAGE_KEY = 'physicsOS.mockRevisionQueueRemoved'
const STATUS_STORAGE_KEY = 'physicsOS.mockRevisionQueueStatus'
const QUEUE_EVENT = 'physicsOS.mockRevisionQueueChanged'

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
 * Local-first "Revision Queue" for Mock Test questions marked for later
 * review. Seeded once from placeholder attempt data, then only ever
 * modified locally (remove / mark reviewed) — no spaced-repetition
 * scheduling, no backend.
 */
export function useMockRevisionQueue() {
  const [removedIds, setRemovedIds] = useState(() => readJson(REMOVED_STORAGE_KEY, []))
  const [statusMap, setStatusMap] = useState(() => readJson(STATUS_STORAGE_KEY, {}))

  useEffect(() => {
    const sync = () => {
      setRemovedIds(readJson(REMOVED_STORAGE_KEY, []))
      setStatusMap(readJson(STATUS_STORAGE_KEY, {}))
    }
    window.addEventListener(QUEUE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(QUEUE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const items = generateRevisionQueueSeed()
    .filter((item) => !removedIds.includes(item.id))
    .map((item) => ({
      ...item,
      status: statusMap[item.id] ?? REVISION_STATUS.PENDING,
    }))

  const removeItem = useCallback(
    (id) => {
      setRemovedIds((prev) => {
        const next = prev.includes(id) ? prev : [...prev, id]
        writeJson(REMOVED_STORAGE_KEY, next)
        return next
      })
    },
    [],
  )

  const toggleReviewed = useCallback(
    (id) => {
      setStatusMap((prev) => {
        const current = prev[id] ?? REVISION_STATUS.PENDING
        const next = {
          ...prev,
          [id]: current === REVISION_STATUS.PENDING ? REVISION_STATUS.REVIEWED : REVISION_STATUS.PENDING,
        }
        writeJson(STATUS_STORAGE_KEY, next)
        return next
      })
    },
    [],
  )

  return { items, removeItem, toggleReviewed }
}
