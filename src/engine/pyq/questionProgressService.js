import StorageService from '../../services/StorageService'
import { PAPER_STATUS } from '../../constants/pyqLibraryConstants'

/**
 * QUESTION PROGRESS SERVICE
 * =========================
 * Sprint 25 — PYQ Engine.
 *
 * Tracks progress (Not Started / In Progress / Completed / Revision
 * Needed) through `services/StorageService.js`. Named for where this is
 * headed rather than what it tracks today: pyq_index.json isn't populated
 * yet (Sprint 26), so there are no individual questions to track — every
 * id passed in this sprint is a whole paper's id. The storage shape below
 * (`{ [id]: status }`) is intentionally generic so Sprint 26 can start
 * passing individual question ids through these exact same functions,
 * once they exist, without changing this file.
 */

const PROGRESS_KEY = 'pyq.progress'

function readAll() {
  const stored = StorageService.get(PROGRESS_KEY, {})
  return stored && typeof stored === 'object' ? stored : {}
}

/** Returns the status for one id (paper today; paper or question from Sprint 26 on). */
function getStatus(id) {
  return readAll()[id] ?? PAPER_STATUS.NOT_STARTED
}

/** Sets the status for one id. Returns the full updated status map. */
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

export const QuestionProgressService = {
  getStatus,
  setStatus,
  getAllStatuses,
  subscribeToProgress,
}

export default QuestionProgressService
