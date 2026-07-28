import StorageService from '../../services/StorageService'

/**
 * BOOKMARK SERVICE
 * ================
 * Sprint 24 — Knowledge Base & Resource Engine.
 *
 * Persists bookmarked resource ids through `services/StorageService.js` —
 * per this sprint's explicit requirement ("Bookmarks must persist using
 * StorageService"), unlike the older `hooks/useFavorites.js` which writes
 * to localStorage directly. This module is plain functions with no React;
 * `hooks/useLibraryBookmarks.js` is the reactive wrapper components use.
 */

const BOOKMARKS_KEY = 'library.bookmarks'

export function getBookmarkIds() {
  const stored = StorageService.get(BOOKMARKS_KEY, [])
  return Array.isArray(stored) ? stored : []
}

export function isBookmarked(resourceId) {
  return getBookmarkIds().includes(resourceId)
}

/** Adds or removes one id from the bookmark list. Returns the new list. */
export function toggleBookmark(resourceId) {
  const current = getBookmarkIds()
  const next = current.includes(resourceId)
    ? current.filter((id) => id !== resourceId)
    : [...current, resourceId]
  StorageService.set(BOOKMARKS_KEY, next)
  return next
}

/** Subscribes to bookmark changes (this tab and others). Returns an unsubscribe function. */
export function subscribeToBookmarks(callback) {
  return StorageService.subscribe(BOOKMARKS_KEY, callback)
}

export const BookmarkService = {
  getBookmarkIds,
  isBookmarked,
  toggleBookmark,
  subscribeToBookmarks,
}

export default BookmarkService
