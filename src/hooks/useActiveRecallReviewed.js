import { useCallback, useEffect, useState } from 'react'

const REVIEWED_STORAGE_KEY = 'physicsOS.activeRecallReviewedCards'
const REVIEWED_EVENT = 'physicsOS.activeRecallReviewedChanged'

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
 * Local-first, UI-only "seen" tracker for Active Recall cards. A card is
 * marked reviewed the first time its answer is revealed, in either Study
 * Mode or Revision Mode. No backend, no spaced repetition scheduling.
 */
export function useActiveRecallReviewed() {
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

  const markReviewed = useCallback((cardId) => {
    setReviewedIds((prev) => {
      if (prev.includes(cardId)) return prev
      const next = [...prev, cardId]
      writeReviewed(next)
      return next
    })
  }, [])

  return { reviewedIds, markReviewed }
}
