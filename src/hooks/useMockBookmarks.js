import { useCallback, useEffect, useState } from 'react'

const BOOKMARKS_STORAGE_KEY = 'physicsOS.mockTestBookmarks'
const BOOKMARKS_EVENT = 'physicsOS.mockTestBookmarksChanged'

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
 * Local-first, UI-only bookmark store for the Mock Test System.
 * No backend, no database — persisted to localStorage only.
 */
export function useMockBookmarks() {
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

  const toggleBookmark = useCallback((testId) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId]
      writeBookmarks(next)
      return next
    })
  }, [])

  return { bookmarkedIds, toggleBookmark }
}
