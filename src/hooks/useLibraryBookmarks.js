import { useCallback, useEffect, useState } from 'react'
import BookmarkService from '../engine/library/bookmarkService'

/**
 * Sprint 24 — Knowledge Base & Resource Engine.
 * Reactive wrapper around `engine/library/bookmarkService.js`. Persists
 * through StorageService, so bookmarks stay in sync across every mounted
 * component and across browser tabs.
 */
export function useLibraryBookmarks() {
  const [bookmarkIds, setBookmarkIds] = useState(BookmarkService.getBookmarkIds)

  useEffect(() => BookmarkService.subscribeToBookmarks(() => setBookmarkIds(BookmarkService.getBookmarkIds())), [])

  const toggleBookmark = useCallback((resourceId) => {
    setBookmarkIds(BookmarkService.toggleBookmark(resourceId))
  }, [])

  return { bookmarkIds, toggleBookmark }
}
