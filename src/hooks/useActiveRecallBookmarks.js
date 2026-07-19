import { useCallback, useEffect, useState } from 'react'

const BOOKMARKS_STORAGE_KEY = 'physicsOS.activeRecallBookmarks'
const BOOKMARKS_EVENT = 'physicsOS.activeRecallBookmarksChanged'

function readBookmarks() {
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeBookmarks(ids) {
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(ids))
    window.dispatchEvent(new Event(BOOKMARKS_EVENT))
  } catch {
    // Local storage unavailable or full; bookmarks won't persist, fail silently.
  }
}

/**
 * Local-first, UI-only bookmark store for the Active Recall module.
 * No backend, no database — persisted to localStorage only.
 * Kept independent from other modules' bookmark hooks per module architecture.
 */
export function useActiveRecallBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState(readBookmarks)

  useEffect(() => {
    const sync = () => setBookmarkedIds(readBookmarks())
    window.addEventListener(BOOKMARKS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(BOOKMARKS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const toggleBookmark = useCallback((cardId) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId]
      writeBookmarks(next)
      return next
    })
  }, [])

  return { bookmarkedIds, toggleBookmark }
}
