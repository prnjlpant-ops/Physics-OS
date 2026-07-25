/**
 * MASTER INDEX CONSTANTS
 * ======================
 * Sprint 22 — Master Index Engine.
 *
 * Shared vocabulary for the Master Index (engine/masterIndexModel.js,
 * engine/masterIndexService.js, context/MasterIndexProvider.jsx) and every
 * module that reads from it. Kept free of React/icon imports so the engine
 * layer stays a plain data module, mirroring knowledgeBaseConstants.js.
 *
 * The Master Index is the single source of truth for every *resource
 * record* in the app (currently Knowledge Base categories; future sprints
 * can add Notes, Formula Sheets, Memory Sheets, PYQs, Study Session and
 * Today's Mission records here too, using the same shape and the same
 * MasterIndexProvider, without changing this file's contract).
 */

export const MASTER_INDEX_VERSION = 1

export const MASTER_INDEX_STORAGE_KEY = 'physicsOS.masterIndex'
export const MASTER_INDEX_EVENT = 'physicsOS.masterIndexChanged'

/**
 * Resource status is always derived, never trusted as-is from imported
 * JSON: a resource with no localPath is always displayed as "Not Added",
 * regardless of what its stored `status` field says. This is what keeps
 * a malformed or partially-filled-in import from ever looking broken.
 */
export const RESOURCE_STATUS = {
  NOT_ADDED: 'Not Added',
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

export const RESOURCE_STATUS_ORDER = [
  RESOURCE_STATUS.NOT_ADDED,
  RESOURCE_STATUS.PENDING,
  RESOURCE_STATUS.IN_PROGRESS,
  RESOURCE_STATUS.COMPLETED,
]

export const RESOURCE_PRIORITY = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

export const RESOURCE_PRIORITY_ORDER = [
  RESOURCE_PRIORITY.HIGH,
  RESOURCE_PRIORITY.MEDIUM,
  RESOURCE_PRIORITY.LOW,
]

export const DEFAULT_RESOURCE_PRIORITY = RESOURCE_PRIORITY.MEDIUM
export const DEFAULT_RESOURCE_STATUS = RESOURCE_STATUS.PENDING
