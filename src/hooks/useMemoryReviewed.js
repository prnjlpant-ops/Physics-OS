import { useCallback, useEffect, useState } from 'react'

const REVIEWED_STORAGE_KEY = 'physicsOS.memoryReviewedCards'
const REVIEWED_EVENT = 'physicsOS.memoryReviewedChanged'

function readReviewed() {
  try {
    const raw = localStorage.getItem(REVIEWED_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeReviewed(ids) {
  try {
    localStorage.setItem(REVIEWED_STORAGE_KEY, JSON.stringify(ids))
    window.dispatchEvent(new Event(REVIEWED_EVENT))
  } catch {
    // Local storage unavailable or full; reviewed state won't persist, fail silently.
  }
}

/**
 * Local-first, UI-only "Mark Reviewed" state for Revision Mode cards.
 * No backend, no database, no spaced repetition scheduling — just a
 * per-card reviewed flag persisted to localStorage.
 */
export function useMemoryReviewed() {
  const [reviewedIds, setReviewedIds] = useState(readReviewed)

  useEffect(() => {
    const sync = () => setReviewedIds(readReviewed())
    window.addEventListener(REVIEWED_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(REVIEWED_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const toggleReviewed = useCallback((cardId) => {
    setReviewedIds((prev) => {
      const next = prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId]
      writeReviewed(next)
      return next
    })
  }, [])

  return { reviewedIds, toggleReviewed }
}
