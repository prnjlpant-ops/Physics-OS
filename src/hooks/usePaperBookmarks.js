import { useCallback, useEffect, useState } from 'react'
import BookmarkService from '../engine/pyq/bookmarkService'

/**
 * Sprint 25 — PYQ Engine.
 * Reactive wrapper around `engine/pyq/bookmarkService.js`. Persists
 * through StorageService, so bookmarks stay in sync across every mounted
 * component and across browser tabs.
 */
export function usePaperBookmarks() {
  const [bookmarkIds, setBookmarkIds] = useState(BookmarkService.getBookmarkIds)

  useEffect(
    () => BookmarkService.subscribeToBookmarks(() => setBookmarkIds(BookmarkService.getBookmarkIds())),
    [],
  )

  const toggleBookmark = useCallback((paperId) => {
    setBookmarkIds(BookmarkService.toggleBookmark(paperId))
  }, [])

  return { bookmarkIds, toggleBookmark }
}
