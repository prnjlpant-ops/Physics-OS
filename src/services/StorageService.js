/**
 * STORAGE SERVICE
 * ===============
 * Sprint 0 — Foundation.
 *
 * The single reusable local storage layer for Physics OS. Every existing
 * feature module (Notes, Favorites, Study Sessions, Planner, etc.) reads
 * and writes localStorage directly with its own small read/write helpers —
 * that pattern still works and is left untouched by this sprint. This
 * service exists so that every NEW module built from this sprint onward
 * has one consistent, safe way to persist data instead of writing another
 * bespoke localStorage wrapper.
 *
 * Design notes:
 * - Every key is namespaced under `physicsOS.` automatically, matching the
 *   convention already used across the app.
 * - Reads/writes are wrapped in try/catch so a full or unavailable
 *   localStorage (private browsing, quota exceeded) never throws into a
 *   component — callers get `defaultValue` back instead.
 * - `subscribe` centralizes the "custom event + storage event" pattern
 *   every existing hook re-implements by hand, so future hooks can listen
 *   for changes in a single line.
 *
 * This module contains no business logic — it does not know what a Task,
 * a Note, or a Setting is. It only stores and retrieves JSON-serializable
 * values by key.
 */

const NAMESPACE = 'physicsOS'
const CHANGE_EVENT_PREFIX = 'physicsOS.storageChanged'

function namespacedKey(key) {
  return key.startsWith(`${NAMESPACE}.`) ? key : `${NAMESPACE}.${key}`
}

function changeEventName(key) {
  return `${CHANGE_EVENT_PREFIX}:${namespacedKey(key)}`
}

/**
 * Reads a JSON value from localStorage.
 * Returns `defaultValue` if the key is missing, unreadable, or malformed.
 */
function get(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(namespacedKey(key))
    if (raw === null) return defaultValue
    return JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

/**
 * Writes a JSON-serializable value to localStorage and notifies listeners.
 * Returns true on success, false if storage was unavailable or full.
 */
function set(key, value) {
  try {
    localStorage.setItem(namespacedKey(key), JSON.stringify(value))
    window.dispatchEvent(new Event(changeEventName(key)))
    return true
  } catch {
    // Local storage unavailable or full; caller's data won't persist.
    return false
  }
}

/**
 * Removes a key from localStorage and notifies listeners.
 */
function remove(key) {
  try {
    localStorage.removeItem(namespacedKey(key))
    window.dispatchEvent(new Event(changeEventName(key)))
    return true
  } catch {
    return false
  }
}

/**
 * Returns true if a key currently exists in localStorage.
 */
function has(key) {
  try {
    return localStorage.getItem(namespacedKey(key)) !== null
  } catch {
    return false
  }
}

/**
 * Subscribes to changes for a single key, both from other tabs (the native
 * `storage` event) and from this tab (the custom event dispatched by
 * `set`/`remove`). Returns an unsubscribe function.
 *
 * Usage inside a hook:
 *   useEffect(() => StorageService.subscribe(key, callback), [key])
 */
function subscribe(key, callback) {
  const handler = () => callback()
  window.addEventListener(changeEventName(key), handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(changeEventName(key), handler)
    window.removeEventListener('storage', handler)
  }
}

export const StorageService = {
  get,
  set,
  remove,
  has,
  subscribe,
}

export default StorageService
