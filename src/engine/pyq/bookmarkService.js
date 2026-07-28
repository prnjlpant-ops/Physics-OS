import StorageService from '../../services/StorageService'

/**
 * BOOKMARK SERVICE
 * ================
 * Sprint 25 — PYQ Engine.
 *
 * Persists bookmarked paper ids through `services/StorageService.js`, the
 * same pattern `engine/library/bookmarkService.js` uses for Library
 * resources — a separate storage key here since papers and Library
 * resources are different record types with different id spaces. Plain
 * functions, no React; `hooks/usePaperBookmarks.js` is the reactive
 * wrapper components use.
 */

const BOOKMARKS_KEY = 'pyq.bookmarks'

function getBookmarkIds() {
  const stored = StorageService.get(BOOKMARKS_KEY, [])
  return Array.isArray(stored) ? stored : []
}

function isBookmarked(paperId) {
  return getBookmarkIds().includes(paperId)
}

/** Adds or removes one id from the bookmark list. Returns the new list. */
function toggleBookmark(paperId) {
  const current = getBookmarkIds()
  const next = current.includes(paperId)
    ? current.filter((id) => id !== paperId)
    : [...current, paperId]
  StorageService.set(BOOKMARKS_KEY, next)
  return next
}

/** Subscribes to bookmark changes (this tab and others). Returns an unsubscribe function. */
function subscribeToBookmarks(callback) {
  return StorageService.subscribe(BOOKMARKS_KEY, callback)
}

export const BookmarkService = {
  getBookmarkIds,
  isBookmarked,
  toggleBookmark,
  subscribeToBookmarks,
}

export default BookmarkService
