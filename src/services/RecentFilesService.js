import StorageService from './StorageService'
import SettingsService from './SettingsService'
import { RECENT_LIST_NAMES, DEFAULT_MAX_RECENT_ITEMS, LAUNCHABLE_RESOURCE_TYPES } from '../constants/desktopConstants'

/**
 * RECENT FILES SERVICE
 * ====================
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Tracks Recent Files (any resource), Recent Topics, Recently Opened
 * Books, and Recently Solved Papers — one persisted, size-limited record
 * per list. `ResourceLauncherService` pushes into this automatically
 * whenever a resource is opened; `WorkspaceService` and future
 * Topic/Study Session pages can push topics directly.
 *
 * History length is user-configurable via Settings -> Maximum Recent
 * Items (`SettingsService`'s `maxRecentItems`, default 10).
 */

const STORAGE_KEY = 'recentItems'

const DEFAULT_STATE = {
  [RECENT_LIST_NAMES.RESOURCES]: [],
  [RECENT_LIST_NAMES.TOPICS]: [],
  [RECENT_LIST_NAMES.BOOKS]: [],
  [RECENT_LIST_NAMES.PAPERS]: [],
}

function readAll() {
  const stored = StorageService.get(STORAGE_KEY, {})
  return { ...DEFAULT_STATE, ...(stored && typeof stored === 'object' ? stored : {}) }
}

function writeAll(state) {
  return StorageService.set(STORAGE_KEY, state)
}

function getMaxItems() {
  const configured = SettingsService.getSetting('maxRecentItems')
  return typeof configured === 'number' && configured > 0 ? configured : DEFAULT_MAX_RECENT_ITEMS
}

/** Pushes an item to the front of a named list, de-duplicating by `id`, capped to the configured max. */
function pushToList(listName, item) {
  if (!item || !item.id) return readAll()

  const state = readAll()
  const list = Array.isArray(state[listName]) ? state[listName] : []
  const withoutDuplicate = list.filter((existing) => existing.id !== item.id)
  const next = [{ ...item, openedAt: new Date().toISOString() }, ...withoutDuplicate].slice(0, getMaxItems())

  const nextState = { ...state, [listName]: next }
  writeAll(nextState)
  return nextState
}

/** Records a resource open — always into "resources", plus its type-specific list when one exists. */
function pushResource(type, item) {
  if (!item || !item.id) return readAll()

  let state = pushToList(RECENT_LIST_NAMES.RESOURCES, { ...item, type })

  if (type === LAUNCHABLE_RESOURCE_TYPES.BOOK) {
    state = pushToList(RECENT_LIST_NAMES.BOOKS, item)
  }
  if (type === LAUNCHABLE_RESOURCE_TYPES.PYQ) {
    state = pushToList(RECENT_LIST_NAMES.PAPERS, item)
  }

  return state
}

function pushTopic(topic) {
  return pushToList(RECENT_LIST_NAMES.TOPICS, topic)
}

function getAll() {
  return readAll()
}

/** Clears one named list, or every list when no name is given. */
function clear(listName) {
  if (!listName) {
    writeAll(DEFAULT_STATE)
    return { ...DEFAULT_STATE }
  }
  const state = readAll()
  const next = { ...state, [listName]: [] }
  writeAll(next)
  return next
}

function subscribe(callback) {
  return StorageService.subscribe(STORAGE_KEY, callback)
}

export const RecentFilesService = {
  pushResource,
  pushTopic,
  getAll,
  clear,
  subscribe,
}

export default RecentFilesService
