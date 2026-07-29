import StorageService from '../../services/StorageService'
import { TOPIC_STATUS } from '../../constants/topicConstants'

/**
 * TOPIC PROGRESS SERVICE
 * ======================
 * Sprint 26 — Topic Index & Study Mapping.
 *
 * Persists per-topic study progress through `services/StorageService.js` —
 * the same pattern `engine/pyq/questionProgressService.js` uses for paper
 * progress, kept as its own storage key since topics and papers are
 * different record types with different id spaces. Plain functions, no
 * React; `hooks/useTopicProgress.js` is the reactive wrapper components use.
 */

const PROGRESS_KEY = 'topics.progress'

function readAll() {
  const stored = StorageService.get(PROGRESS_KEY, {})
  return stored && typeof stored === 'object' ? stored : {}
}

/** Returns the status for one topic id. */
function getStatus(id) {
  return readAll()[id] ?? TOPIC_STATUS.NOT_STARTED
}

/** Sets the status for one topic id. Returns the full updated status map. */
function setStatus(id, status) {
  const next = { ...readAll(), [id]: status }
  StorageService.set(PROGRESS_KEY, next)
  return next
}

function getAllStatuses() {
  return readAll()
}

/** Subscribes to progress changes (this tab and others). Returns an unsubscribe function. */
function subscribeToProgress(callback) {
  return StorageService.subscribe(PROGRESS_KEY, callback)
}

export const TopicProgressService = {
  getStatus,
  setStatus,
  getAllStatuses,
  subscribeToProgress,
}

export default TopicProgressService
